# 🚀 Full-Stack To-Do Planner (Frontend)

A modern, highly responsive, and feature-rich To-Do List & Planner application built with **Next.js (App Router)** and **Chakra UI v3**.

🌍 **Live Demo:** [https://rabia-todo-app-123.vercel.app](https://rabia-todo-app-123.vercel.app)

## ✨ Features

- **Global Localization (i18n):** Seamlessly translated into **11 languages** (English, Turkish, German, Spanish, French, Italian, Russian, Arabic, Chinese, Japanese, Korean) using `next-intl`.
- **Modern UI & UX:** Beautifully designed using **Chakra UI v3**, featuring glassmorphism elements, dynamic task cards, and a sleek planner layout.
- **Theme Support:** Fully optimized Light and Dark mode transitions.
- **Authentication:** Secure user authentication (Login/Register) utilizing JWT tokens.
- **Task Management:** Complete CRUD operations for tasks (Add, Edit, Complete, Delete) with categorized groupings (Work, Personal, Education, Sports).
- **Interactive Calendar:** A mini-calendar to easily filter tasks by date.
- **Performance Optimized:** Fast rendering with Next.js Turbopack and efficient client-side state management using Redux Toolkit.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Chakra UI v3
- **State Management:** Redux Toolkit & Redux Saga
- **Internationalization:** `next-intl`
- **Language:** TypeScript

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rabiaozden2/todo-frontend.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=https://todo-backend-z6fv.onrender.com/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Backend Repository
The Go & PostgreSQL backend for this project can be found here: [Todo Backend](https://github.com/rabiaozden/todo-backend)
