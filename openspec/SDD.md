# KrSu-wem 電商平台 — 系統設計文件（SDD）

## 1. 功能描述

| 模組 | 說明 |
|------|------|
| 前台-購物 | 商品列表、分類篩選、搜尋、商品詳情 Modal、加入購物車 |
| 前台-結帳 | 三步驟結帳流程（填資料→確認→完成）、優惠碼、超商/宅配取貨 |
| 前台-會員 | 信箱/手機/Google 三種登入，訂單查詢、個人資料、收件地址管理 |
| 後台-商品 | 新增/編輯/上下架商品、庫存管理、特價設定 |
| 後台-訂單 | 訂單列表、狀態更新（待處理→備貨中→已出貨→已完成/取消） |
| 後台-優惠 | 建立優惠碼（固定金額/百分比）、最低消費限制、啟停用 |
| 後台-取貨 | 自訂取貨方式（超商/宅配/其他）、各別運費設定 |
| 後台-設定 | 公告橫幅管理、管理員授權、Firebase 安全規則說明 |

## 2. 資料來源分析

| 資料項目 | 來源 | 說明 |
|----------|------|------|
| 商品資料 | [INTERNAL] 使用者於本系統自行維護 | 後台新增商品 |
| 訂單資料 | [INTERNAL] 使用者於本系統自行維護 | 消費者結帳產生 |
| 會員資料 | [INTERNAL] Firebase Auth + Firestore | 註冊時建立 |
| 優惠碼 | [INTERNAL] 使用者於本系統自行維護 | 後台建立 |
| 取貨設定 | [INTERNAL] 使用者於本系統自行維護 | 後台設定 |
| 公告橫幅 | [INTERNAL] 使用者於本系統自行維護 | 後台設定 |

## 3. 資料庫設計（Firestore Collections）

### products
```
{
  name: string,
  category: string,
  price: number,
  salePrice: number | null,
  stock: number,
  imageUrl: string,
  description: string,
  active: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### orders
```
{
  userId: string,           // Firebase Auth UID
  items: [{id, name, price, qty, imageUrl}],
  receiver: {name, phone, email},
  shipping: {method, type, fee, address},
  payment: {method},        // cod | transfer | credit
  coupon: {code, discount} | null,
  note: string,
  subtotal: number,
  total: number,
  status: string,           // pending | processing | shipped | completed | cancelled
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### users
```
{
  name: string,
  email: string,
  phone: string,
  addresses: [{label, zip, city, detail}],
  createdAt: timestamp
}
```

### coupons (document ID = 優惠碼)
```
{
  type: 'fixed' | 'percent',
  value: number,
  minAmount: number,
  active: boolean,
  createdAt: timestamp
}
```

### admins (document ID = uid)
```
{ grantedAt: timestamp }
```

### settings/shipping
```
{
  options: [{id, label, type, fee, enabled}],
  updatedAt: timestamp
}
```

### settings/banners
```
{
  items: [{text}],
  updatedAt: timestamp
}
```

## 4. 自動計算邏輯

| 欄位 | 公式 | 驗收範例 |
|------|------|----------|
| 商品特價 | `salePrice ?? price` | 原價 500，特價 399 → 顯示 399 |
| 購物車小計 | `Σ (price × qty)` | 商品A 200×2 + 商品B 100×1 = 500 |
| 訂單總計 | `小計 + 運費 - 折扣` | 500 + 60 - 50 = 510 |
| 百分比折扣 | `round(小計 × value / 100)` | 小計 1000，折 10% → 折扣 100 |
| 庫存扣減 | 下單成功後批次 `increment(-qty)` | 庫存 10，買 2 → 剩 8 |

## 5. 業務規則

- 管理員判斷：`admins/{uid}` 文件存在 → 導向後台，否則導向前台
- 商品下架（`active=false`）後，前台不顯示，但既有訂單中的商品名稱保留快照
- 優惠碼套用後儲存於 `sessionStorage`，結帳完成或清空購物車後失效
- 庫存歸零後前台顯示「已售完」，無法加入購物車

## 6. 待 IT 串接項目

- [ ] 信用卡金流 API（checkout.html 付款方式選信用卡區塊）
- [ ] 超商物流 API 自動選店地圖（shipping.html 說明）
- [ ] Firebase Cloud Functions：庫存扣減原子性保護（目前為 batch write）
- [ ] 訂單狀態變更時發送 Email 通知（Firebase Extension 或自建）
