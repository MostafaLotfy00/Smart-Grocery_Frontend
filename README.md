# 🛒 Smart Grocery - Frontend  
### 🚀 Angular 17 Grocery Management System

<p align="center">
  <b>A modern frontend application that connects meal discovery with smart grocery planning.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-17-red?logo=angular" />
  <img src="https://img.shields.io/badge/RxJS-Reactive-blue" />
  <img src="https://img.shields.io/badge/JWT-Auth-green" />
  <img src="https://img.shields.io/badge/UI-Bootstrap%205-purple" />
</p>

---

## 📌 Overview
**Smart Grocery (Frontend)** is a modern Angular application that provides an interactive and responsive user experience for discovering meals and managing grocery shopping.

It integrates seamlessly with a **Spring Boot backend** to deliver a complete full-stack solution.

---

## 🎯 Objective
Bridge the gap between **meal discovery** and **grocery planning** through a clean and efficient user experience.

---

## ✨ Key Features

### 👤 User Module (Discovery & Planning)
- 🧾 **Dynamic Catalog**: Browse meals using visually rich cards  
- 🔍 **Smart Filtering**: Search instantly by meal name or category  
- 🛒 **Shopping List (Cart System)**:
  - Add items to a persistent shopping list  
  - Interactive **Side Drawer** for managing items  
  - Real-time **Cart Counter** in the header  
- 🎬 **Meal Details View**:
  - Instructions display  
  - YouTube video integration  
- ✅ **User Feedback System**:
  - Success & Delete modals  

---

### 🛡️ Admin Dashboard (Management)
- 📦 **Full CRUD Operations** (Create, Update, Delete products)  
- 🌐 **External API Integration** (import meals/products)  
- 🧭 **Optimized Layout** (Sidebar + Sticky Navbar)  
- 🔐 **Secure Routing** with role-based access  

---

## 🧱 Architecture
```
Angular (Frontend)  →  Spring Boot (Backend)  →  Database
```

---

## 🛠️ Tech Stack

### Frontend
- Angular 17 (Standalone Components)
- RxJS
- Bootstrap 5 + SCSS
- Bootstrap Icons

### Security
- JWT Authentication
- HTTP Interceptors

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- Node.js (v18 or higher)  
- Angular CLI  

---

### 🔹 Steps to Run

#### 1. Clone the project
```bash
git clone https://github.com/your-username/smart-grocery-frontend.git
cd smart-grocery-frontend
```

#### 2. Backend Configuration
- Ensure backend is running at:
```
http://localhost:8080
```

- Update:
```
- Configure backend API URL in:
  `src/environments/environment.ts`

  Set it to:
  http://localhost:8080
```

---

#### 3. Run the application
```bash
ng serve
```

Open in browser:
```
http://localhost:4200
```

---

## 🔐 Demo Credentials

| Role      | Username | Password  |
|-----------|----------|-----------|
| **Admin** | `admin`  | `admin` |
| **User**  | `user`   | `user` |

---

## 👨‍💻 Author
**Mostafa Lotfy**  
FullStack Developer | Spring Boot | Angular | DevOps Enthusiast  

📧 mostafalotfy3112@gmail.com  

---

## ⭐ Final Note
If you like this project, don’t forget to **star the repository** ⭐