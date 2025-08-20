# 🧙‍♂️ LevelingApp - Solo Training

App de entrenamiento inspirada en **Solo Leveling**, con un sistema de quests, stats y progresión tipo RPG.  
Desarrollada con **NestJS** en el backend y **React + Vite** en el frontend.

---

## 📦 Estructura del proyecto

leveling/
├── backend/ → API con NestJS
│ └── solo-training/
├── frontend/ → Interfaz de usuario en React
└── README.md → Este archivo

---

## 🚀 Instalación y ejecución

### 🔧 Backend (`solo-training`)

1. Entrar a la carpeta del backend:

   cd backend/solo-training

2. Instalar dependencias:
    npm install

3. Configurar entorno:

    Crear archivo .env si no existe.

    Variables típicas:

    PORT=3000
    MONGO_URI=mongodb://localhost:27017/levelingapp

4. Ejecutar servidor:

    npm start dev


### 🌐 Frontend

1. Ir a la carpeta del frontend:

    cd frontend

2. Instalar dependencias:

    npm install

3. Ejecutar en desarrollo:

    npm run dev

4. Acceder desde: http://localhost:5173

---

## 🔧 Tecnologías utilizadas

    Backend: NestJS, Fastify, MongoDB, Mongoose

    Frontend: React, Vite, TailwindCSS

    Auth: JWT, Fastify plugins

    Infra futura: GitHub Actions, Mongo Atlas, Netlify/Vercel

---

## ✍️ Autor

    Joaquín Brondo
    📧 joakobrondo@gmail.com

---

## 📌 Estado actual

    ✅ Repositorio unificado
    ✅ CRUD de jugador
    ✅ Sistema de quests
    🚧 En desarrollo: calendario, progreso visual, mejoras de UI