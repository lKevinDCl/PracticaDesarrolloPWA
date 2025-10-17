import { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
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

  // 1. CONFIGURAR LISTENERS DE CONEXIÓN
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

  // 2. ESCUCHAR CAMBIOS EN FIRESTORE (¡AUTOMÁTICO!)
  useEffect(() => {
    const q = query(collection(db, 'entries'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData: Entry[] = [];
      
      snapshot.forEach((doc) => {
        entriesData.push({
          id: doc.id,
          ...doc.data()
        } as Entry);
      });

      setEntries(entriesData);
    });

    return () => unsubscribe();
  }, []);

  // 3. MANEJAR ENVÍO (¡SUPER SIMPLE!)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) return;

    try {
      // Esto funciona OFFLINE u ONLINE automáticamente
      await addDoc(collection(db, 'entries'), {
        title,
        description,
        createdAt: serverTimestamp(), // Usar timestamp del servidor
        synced: false // Inicialmente no sincronizado
      });

      setTitle('');
      setDescription('');
      
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="container">
      <h1>Lista con Firebase</h1>

      {/* Estado de conexión */}
      <div style={{ 
        padding: '10px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
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

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">
          {isOnline ? 'Guardar' : 'Guardar (Local)'}
        </button>
      </form>

      {/* Lista de entradas */}
      <h2>Registros ({entries.length})</h2>
      <div style={{ marginTop: '20px' }}>
        {entries.map((entry) => (
          <div 
            key={entry.id}
            style={{
              padding: '15px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 5px 0' }}>{entry.title}</h3>
            <p style={{ margin: '0 0 10px 0' }}>{entry.description}</p>
            <small style={{ color: '#666' }}>
              {entry.createdAt?.toDate ? 
                entry.createdAt.toDate().toLocaleString() : 
                'Sincronizando...'
              }
            </small>
          </div>
        ))}
      </div>

      {/* Información de Firebase */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Firebase Magic:</h4>
        <ul>
          <li>Sincronización automática</li>
          <li>Funciona offline</li>
          <li>Conflictos resueltos automáticamente</li>
          <li>Escalable</li>
          <li>Sin Service Workers complicados</li>
        </ul>
      </div>
    </div>
  );
}