const Routes = (()=>{
  const historyStack = [];
  function show(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const el = document.getElementById('screen-'+id);
    if(el) el.classList.add('active');
    const crumb = document.getElementById('crumb');
    if(crumb) crumb.textContent = (id==='home'?'Start':'Einstellung');
    window.location.hash = '#'+id;
  }
  function go(id){
    const cur = (location.hash||'#home').slice(1);
    if(cur!==id) historyStack.push(cur);
    show(id);
  }
  function back(){
    const prev = historyStack.pop() || 'home';
    show(prev);
  }
  function init(){
    window.addEventListener('hashchange', ()=> show((location.hash||'#home').slice(1)));
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-nav]');
      if(btn){ go(btn.getAttribute('data-nav')); }
    });
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ back(); } });
    show((location.hash||'#home').slice(1));
    // Footer back
    document.addEventListener('click', (e)=>{
      if(e.target && e.target.id==='footerBack'){ back(); }
    });
  }
  return { init, go, back };
})();
