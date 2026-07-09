(function(){
  var n = localStorage.getItem('reyi_ep_store_name') || '日翊員購小舖';
  if (!n) return;
  function apply() {
    document.querySelectorAll('.store-name-el').forEach(function(el){ el.textContent = n; });
    document.title = n;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
