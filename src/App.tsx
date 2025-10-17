import { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';
import { app, db } from './firebase'; 
import './App.css';

interface Entry {
  id: string;
  title: string;
  description: string;
  createdAt: any;
  synced?: boolean;
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'entries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData: Entry[] = [];
      snapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() } as Entry);
      });
      setEntries(entriesData);
    });
    return () => unsubscribe();
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Tu navegador no soporta notificaciones push.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      console.log('Permiso de notificación concedido.');
      const messaging = getMessaging(app);
      const VAPID_KEY = 'BNamnAgqF1qqq9vgrWP_pCd9mEJR1KF_Z1dnLlQpYnYqGH1Cu1A3LejfhTfotKxPmFsfxtSYA1g6aV8BwaShFl8';
      
      try {
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
          console.log('Token de FCM obtenido:');
          console.log(currentToken);
          alert('Suscripción exitosa. Revisa la consola para ver tu token.');
        } else {
          console.log('No se pudo obtener el token.');
        }
      } catch (error) {
        console.error('Ocurrió un error al obtener el token.', error);
      }
    } else {
      console.log('Permiso de notificación denegado.');
    }
  };

  // --- NUEVA FUNCIÓN PARA MOSTRAR NOTIFICACIÓN LOCAL ---
  const showLocalNotification = () => {
    // Verifica que el permiso esté concedido antes de intentar mostrar nada
    if (notificationPermission !== 'granted') {
      alert('Primero debes activar las notificaciones.');
      return;
    }
    
    // Usa el Service Worker activo para mostrar la notificación
    // Esto simula cómo se vería una notificación push real
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Prueba Local 📢', {
        body: '¡Este mensaje fue generado desde la propia app!',
        icon: '/vite.svg', // El ícono que aparecerá en la notificación
        badge: '/vite.svg', // Ícono para la barra de notificaciones en Android
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    try {
      await addDoc(collection(db, 'entries'), {
        title,
        description,
        createdAt: serverTimestamp(),
        synced: false
      });
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="container">
      <h1>Lista by Kevin</h1>

      {/* ... (Todo el resto del JSX de conexión, formulario y lista se mantiene igual) ... */}
       {/* Estado de conexión (Sin cambios) */}
      <div style={{ padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
        {isOnline ? (
          <p style={{ color: 'green', margin: 0 }}>
            Conectado - Sincronización automática activada
          </p>
        ) : (
          <p style={{ color: 'red', margin: 0 }}>
            Sin conexión - Los datos se guardarán localmente y se sincronizarán automáticamente
          </p>
        )}
      </div>
       {/* Formulario (Sin cambios) */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">{isOnline ? 'Guardar' : 'Guardar (Local)'}</button>
      </form>
       {/* Lista de entradas (Sin cambios) */}
      <h2>Registros ({entries.length})</h2>
      <div style={{ marginTop: '20px' }}>
        {entries.map((entry) => (
          <div key={entry.id} style={{ padding: '15px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{entry.title}</h3>
            <p style={{ margin: '0 0 10px 0' }}>{entry.description}</p>
            <small style={{ color: '#666' }}>
              {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : 'Sincronizando...'}
            </small>
          </div>
        ))}
      </div>
       {/* Información de Firebase (Sin cambios) */}
      <div style={{ marginTop: '30px', padding: '15px', borderRadius: '8px', fontSize: '14px' }}>
        <h4>Firebase Magic:</h4>
        <ul>
          <li>Sincronización automática</li>
          <li>Funciona offline</li>
          <li>Conflictos resueltos automáticamente</li>
          <li>Escalable</li>
          <li>Sin Service Workers complicados</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
        <h4>Notificaciones Push</h4>
        {notificationPermission === 'granted' ? (
          <div>
            <p style={{ color: 'green', margin: 0 }}>Las notificaciones ya están activadas.</p>
            {/* --- NUEVO BOTÓN DE PRUEBA --- */}
            <button onClick={showLocalNotification} style={{ marginTop: '10px' }}>
              Enviar Notificación de Prueba
            </button>
          </div>
        ) : (
          <>
            <p>Haz clic en el botón para recibir notificaciones importantes.</p>
            <button onClick={requestNotificationPermission} disabled={notificationPermission === 'denied'}>
              {notificationPermission === 'denied' ? 'Permiso Bloqueado' : 'Activar Notificaciones'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}