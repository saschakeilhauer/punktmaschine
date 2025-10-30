const App = (()=>{
  let data = [];
  let current = null;

  function el(sel){ return document.querySelector(sel); }
  function els(sel){ return Array.from(document.querySelectorAll(sel)); }

  async function loadData(){
    data = await fetch('assets/data/programme.json').then(r=>r.json());
  }

  function renderGrid(){
    const g = el('#grid'); g.innerHTML='';
    data.forEach(p=>{
      const div = document.createElement('div');
      div.className='tile';
      div.innerHTML = `<strong>${p.label}</strong><span>Programm: ${p.nr}</span>`;
      div.addEventListener('click', ()=> select(p.key));
      g.appendChild(div);
    });
  }

  function stepsFor(p){
    const druck = (p.druck===null || p.druck===undefined) ? '—' : p.druck+' bar';
    return [
      'F4 → Menü',
      'F2 → PIN = 3',
      'F4 → Tafel 45',
      `Programmnummer = ${p.nr}`,
      `Luftdruck Soll = ${druck}`
    ];
  }

  function renderSetup(){
    if(!current){ return; }
    const p = data.find(x=>x.key===current);
    el('#setupTitle').textContent = p.label;
    const ul = el('#stepList'); ul.innerHTML='';
    stepsFor(p).forEach(s=>{
      const li = document.createElement('li'); li.textContent = s; ul.appendChild(li);
    });
    // reset checks/status
    els('#screen-setup [data-check]').forEach(cb=>{ cb.checked=false; });
    updateStatus();
  }

  function updateStatus(){
    const all = els('#screen-setup [data-check]');
    const ok = all.every(cb=>cb.checked);
    const st = el('#status');
    st.textContent = ok ? 'Status: bereit zum Schweißen' : 'Status: unvollständig';
    st.classList.toggle('ok', ok);
  }

  function select(key){
    current = key;
    Routes.go('setup');
    renderSetup();
  }

  function bind(){
    document.addEventListener('change', (e)=>{
      if(e.target.matches('#screen-setup [data-check]')) updateStatus();
    });
    el('#btnBack').addEventListener('click', ()=> Routes.back());
    el('#btnReset').addEventListener('click', ()=>{
      current=null;
      window.location.hash = '#home';
      Routes.back();
    });
    el('#btnPrint').addEventListener('click', ()=> window.print());

    // Theme toggle
    document.addEventListener('click', (e)=>{
      if(e.target.closest('#modeToggle button')){
        const b = e.target.closest('button');
        setMode(b.dataset.mode);
      }
    });
    setMode('light');     //(localStorage.getItem('pm-mode')||'auto');
  }

  function setMode(mode){localStorage.setItem('pm-mode', mode);
    const eff = (mode==='light')
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    document.documentElement.setAttribute('data-theme', eff);
    document.querySelectorAll('#modeToggle button').forEach(b=>b.classList.toggle('active', b.dataset.mode===mode));
  }

  async function init(){
    await loadData();
    renderGrid();
    Routes.init();
    bind();
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
