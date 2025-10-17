# PWA de Tareas con Firebase y Capacidades Offline 🚀

Este proyecto es una **Progressive Web App (PWA)** de lista de tareas construida con **React, Vite, TypeScript y Firebase**.  
Está diseñada para ser **rápida, confiable e instalable**, con un fuerte enfoque en la **funcionalidad offline**, garantizando una experiencia de usuario fluida incluso sin conexión a internet.

---

## ✨ Características Principales

Esta aplicación va más allá de un CRUD básico e implementa características avanzadas de las **PWA modernas**:

### 1. Soporte Offline Completo

La aplicación es **100% funcional sin conexión a internet**.

- **Persistencia de Datos:**  
  Utiliza Firestore con su potente SDK, que activa la persistencia en **IndexedDB** automáticamente.  
  Cualquier tarea creada o modificada offline se guarda localmente y se sincroniza con la nube al recuperar la conexión.

- **Cacheo del App Shell:**  
  El "cascarón" de la aplicación (HTML, CSS, JS principal) se guarda en caché mediante un **Service Worker**, permitiendo que la app se cargue instantáneamente en visitas posteriores, con o sin red.

---

### 2. Estrategias de Cacheo Avanzadas (`sw.js`)

Se implementa un **Service Worker personalizado** con múltiples estrategias para optimizar el rendimiento y la resiliencia:

- **Cache First:**  
  Para los archivos críticos del App Shell. Sirve desde caché primero para lograr una carga ultra rápida.

- **Stale-While-Revalidate:**  
  Para recursos no críticos (imágenes, fuentes, etc.).  
  Sirve la versión en caché al instante mientras solicita una nueva en segundo plano.

- **Página de Fallback Offline:**  
  Si el usuario intenta acceder offline a una página no cacheada, se muestra una página personalizada (`offline.html`) en lugar de un error del navegador.

---

### 3. Instalable en Cualquier Dispositivo

Gracias a la configuración del `manifest.json` y el registro del `Service Worker`, la aplicación es **totalmente instalable**:

- **Escritorio:** Se puede instalar desde Chrome o Edge, ofreciendo una experiencia tipo app nativa.  
- **Móvil:** Se puede añadir a la pantalla de inicio en Android y iOS.

---

### 4. Notificaciones Push

Integración completa con **Firebase Cloud Messaging (FCM)** para enviar notificaciones push y mantener a los usuarios informados.

- **Suscripción Segura:**  
  El usuario puede conceder permisos de notificación de forma segura.  
- **Manejo en Segundo Plano:**  
  Un Service Worker dedicado (`firebase-messaging-sw.js`) recibe y muestra notificaciones incluso cuando la app está cerrada.

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnologías |
|------------|--------------|
| **Frontend** | React, TypeScript, Vite |
| **Backend y BD** | Firebase (Firestore, Cloud Messaging) |
| **Offline / PWA** | Service Worker API, Cache API, IndexedDB (gestionado por Firestore) |

---

## 🚀 Instalación y Uso Local

Para ejecutar el proyecto localmente:

```bash
# Clona el repositorio
git clone https://github.com/lKevinDCl/PracticaDesarrolloPWA.git
cd PracticaDesarrolloPWA
```
# Instala las dependencias
```bash
npm install
```
1️⃣ Configura Firebase
Crea un proyecto en Firebase Console.

Activa Firestore y Cloud Messaging.

Obtén tu configuración (firebaseConfig) y agrégala en firebase.ts (renombrando el archivo firebase.example.ts).

Genera un par de claves VAPID en Cloud Messaging y copia la clave pública en App.tsx dentro de la constante VAPID_KEY.

2️⃣ Ejecuta el servidor de desarrollo
```bash
npm run dev
```
3️⃣ Genera la versión de producción
```bash
npm run build
```
Esto creará la carpeta dist, lista para ser desplegada.

📦 Publicación y Pruebas
Para probar todas las funcionalidades (especialmente HTTPS), despliega la carpeta dist en servicios como:

Vercel ✅ (recomendado por su facilidad de uso)

Netlify

GitHub Pages

Una vez desplegada, puedes usar Lighthouse (en Chrome DevTools) para auditar:

Desempeño 

Accesibilidad 

Buenas prácticas

Conformidad con PWA 

<details> <summary><strong>Detalles del Template Original de Vite</strong></summary>
React + TypeScript + Vite

Este template provee una configuración mínima para usar React con Vite y Hot Module Replacement (HMR).

Plugins disponibles:

@vitejs/plugin-react → usa Babel para Fast Refresh

@vitejs/plugin-react-swc → usa SWC para Fast Refresh

Expansión del ESLint:
Si desarrollas una aplicación para producción, se recomienda habilitar reglas de linting que analicen los tipos para un código más robusto.

</details>