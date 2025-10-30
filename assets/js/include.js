document.addEventListener('DOMContentLoaded', async ()=>{
  const inc = document.querySelectorAll('[data-include]');
  for(const el of inc){
    const url = el.getAttribute('data-include');
    try{ const res = await fetch(url); el.innerHTML = await res.text(); }
    catch{ el.innerHTML = '<div class="muted">Fehler beim Laden: '+url+'</div>'; }
  }
});
