import { useEffect, useState } from "react";
import { addEntry, getAllEntries } from "./utils/db";
import './App.css';

interface Entry {
  id?: number;
  title: string;
  description: string;
  date?: string;
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    loadEntries();

    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));

    return () => {
      window.removeEventListener("online", () => setIsOffline(false));
      window.removeEventListener("offline", () => setIsOffline(true));
    };
  }, []);

  const loadEntries = async () => {
    const all = await getAllEntries();
    setEntries(all);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEntry({ title, description });
    setTitle("");
    setDescription("");
    await loadEntries();
  };

  return (
    <div className="container">
      <h1>Lista Offline</h1>

      {isOffline && (
        <p style={{ color: "red" }}>Estás sin conexión</p>
      )}

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
        ></textarea>
        <button type="submit">Guardar</button>
      </form>

      <h2>Registros guardados</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.title}</strong> - {entry.description}
            <br />
            <small>{new Date(entry.date!).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
