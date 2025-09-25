const CACHE = 'bujo-cache-v2'; // قبلاً v1 بود، یک عدد بزرگ‌تر بگذار
const ASSETS = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(net => {
      if (req.method==='GET' && net.ok) {
        const copy = net.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return net;
    }).catch(()=>caches.match('./index.html')))
  );
});
