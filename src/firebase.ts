import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6MrlFj4uF80ALuNxsviiITHTrKdXrCs0",
  authDomain: "pwa-by-kevindc.firebaseapp.com",
  projectId: "pwa-by-kevindc",
  storageBucket: "pwa-by-kevindc.firebasestorage.app",
  messagingSenderId: "506449540959",
  appId: "1:506449540959:web:fee5ec9ec7e1f77a03a8ea"
};


// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Obtener Firestore
export const db = getFirestore(app);

// Activar persistencia offline (¡MÁGICO! 🎩)
enableIndexedDbPersistence(db)
  .then(() => console.log('✅ Persistencia offline activada'))
  .catch(err => {
    if (err.code == 'failed-precondition') {
      console.log('⚠️ Múltiples pestañas abiertas');
    } else if (err.code == 'unimplemented') {
      console.log('❌ Navegador no compatible');
    }
  });

export default app;