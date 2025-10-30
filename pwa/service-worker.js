const CACHE='pm-op-v1';
const ASSETS=[
  '/','/index.html',
  '/partials/header.html','/partials/footer.html',
  '/assets/css/base.css',
  '/assets/js/include.js','/assets/js/routes.js','/assets/js/app.js',
  '/assets/data/programme.json',
  '/assets/img/icon-192.png','/assets/img/icon-512.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
  const url = new URL(e.request.url);
  if(ASSETS.includes(url.pathname)){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }else{
    e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));
  }
});
