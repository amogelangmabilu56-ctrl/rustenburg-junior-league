const C="rjl-v13";
const SDK=["https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"];
const FILES=["./","index.html","manifest.json","logo.png","favicon.png","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","rjl-teams-template.xlsx","rjl-fixtures-template.xlsx","privacy.html"];
// Files the app needs to open with no signal. Firebase scripts and fonts come from Google, so they are cached too.
const OK_HOSTS=[location.host,"www.gstatic.com","fonts.googleapis.com","fonts.gstatic.com","cdn.sheetjs.com","cdn.jsdelivr.net"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all([c.addAll(FILES),...SDK.map(u=>c.add(u).catch(()=>{}))])));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||!OK_HOSTS.includes(u.host))return;
  // App files are always checked with the site first, so a new upload shows straight away
  const req=u.host===location.host?new Request(e.request.url,{cache:"no-cache",credentials:"same-origin"}):e.request;
  e.respondWith(fetch(req).then(r=>{if(r.ok||r.type==="opaque"){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));}return r}).catch(()=>caches.match(e.request,{ignoreSearch:u.host===location.host})));
});
