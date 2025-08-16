const CACHE_NAME = 'minha-rotina-cache-v3'; // Versão do cache alterada para forçar a atualização
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://unpkg.com/@phosphor-icons/web@2.0.3',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// Evento de Instalação: O Service Worker é instalado
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto e arquivos adicionados.');
        // Usar addAll para garantir que todos os recursos essenciais sejam cacheados.
        // Se um falhar, a instalação inteira falha.
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Força o novo Service Worker a ativar-se imediatamente
  );
});

// Evento de Ativação: O Service Worker começa a controlar a página
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Apaga caches antigos que não correspondem ao CACHE_NAME atual
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Torna-se o controlador de todas as abas abertas
  );
});

// Evento de Fetch: Intercepta pedidos de rede para funcionamento offline
self.addEventListener('fetch', event => {
  // Estratégia: Cache first, caindo para a rede se não encontrar no cache.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna a resposta do cache se encontrada, senão busca na rede
        return response || fetch(event.request);
      })
  );
});

// Evento de Push: Essencial para notificações em segundo plano
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Minha Rotina';
  const options = {
    body: data.body || 'Você tem uma nova tarefa ou lembrete.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Evento de Clique na Notificação: Define o que acontece quando o usuário clica na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se a aplicação já estiver aberta, foca nela
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      // Se não, abre uma nova janela
      return clients.openWindow('/');
    })
  );
});