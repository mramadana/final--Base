// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDOUOlsKyQNLXS5SkAfjFx_AZNfQwGNmQw",
    authDomain: "reevent-a9329.firebaseapp.com",
    projectId: "reevent-a9329",
    storageBucket: "reevent-a9329.firebasestorage.app",
    messagingSenderId: "809206444734",
    appId: "1:809206444734:web:0c426953192d983e4364ef"
  });


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    // const notificationTitle = payload.data.title_ar;
    // const notificationOptions = {
    //   body: payload.data.message_ar,
    //   icon: payload.data.sender_avatar
    // };
  
    // self.registration.showNotification(notificationTitle, notificationOptions);


    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
    
        const targetUrl = event.notification?.data?.url || '/';
    
        event.waitUntil(
            clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url === targetUrl && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
        );
    });

  });