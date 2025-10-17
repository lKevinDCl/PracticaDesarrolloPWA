// Importa los scripts de Firebase
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Usa la misma configuración de tu archivo firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyB6MrlFj4uF80ALuNxsviiITHTrKdXrCs0",
  authDomain: "pwa-by-kevindc.firebaseapp.com",
  projectId: "pwa-by-kevindc",
  storageBucket: "pwa-by-kevindc.firebasestorage.app",
  messagingSenderId: "506449540959",
  appId: "1:506449540959:web:fee5ec9ec7e1f77a03a8ea"
};

// Inicializa la app de Firebase
firebase.initializeApp(firebaseConfig);

// Obtiene la instancia de Messaging
const messaging = firebase.messaging();