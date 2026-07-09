# KrSu-wem 電商平台

線上購物平台，支援前台購物與後台賣家管理，部署於 Firebase。

## 核心功能

- **前台**：商品瀏覽、搜尋篩選、購物車、三步驟結帳、超商/宅配取貨、優惠碼
- **後台**：商品上下架、庫存管理、訂單處理、優惠碼設定、取貨方式設定
- **會員**：Email / 手機 / Google 三種登入，訂單查詢，地址管理

## 專案結構

```
KrSu-wem/
├── index.html          ← 登入/註冊（入口）
├── shop.html           ← 前台商品列表
├── cart.html           ← 購物車
├── checkout.html       ← 結帳流程
├── member.html         ← 會員中心
├── admin/
│   ├── index.html      ← 後台儀表板
│   ├── products.html   ← 商品管理
│   ├── orders.html     ← 訂單管理
│   ├── promotions.html ← 優惠碼設定
│   ├── shipping.html   ← 取貨方式設定
│   └── settings.html   ← 系統設定
├── js/
│   ├── firebase-config.js  ← Firebase 設定（須填入實際設定）
│   └── cart.js             ← 購物車邏輯
├── css/
│   └── style.css
└── openspec/
    ├── SDD.md              ← 系統設計文件
    └── api-interface.json  ← API 介面定義
```

## 快速部署

1. **建立 Firebase 專案**：前往 [Firebase Console](https://console.firebase.google.com)
2. **填入設定**：編輯 `js/firebase-config.js`，替換 `YOUR_*` 欄位
3. **啟用服務**：Authentication（Email+Password, Google, Phone）、Firestore、Hosting
4. **設定安全規則**：參考 `admin/settings.html` 內的規則範例
5. **部署**：
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```
6. **建立第一位管理員**：在 Firestore 手動新增 `admins/{your-uid}` 文件

## IT 工程師待串接

| 項目 | 位置 | 說明 |
|------|------|------|
| 信用卡金流 | `checkout.html` | 選信用卡付款區塊，標有 TODO 註解 |
| 超商物流選店 | `admin/shipping.html` | 需串接各超商物流 API |
| 庫存原子性 | `checkout.js` submitOrder | 建議改用 Cloud Functions Transaction |
| 訂單通知 Email | Firebase Extension | Trigger Email 或 SendGrid |
