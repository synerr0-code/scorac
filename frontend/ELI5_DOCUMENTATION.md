# 🎓 Code Grader - ELI5 Documentation

> **Explain It Like I'm 5**: This document explains the Code Grader app in super simple terms!

---

## 🤔 What Is This App?

Imagine a **robot helper for teachers**! 🤖

When students do coding homework, this app:
1. Lets **teachers** create assignments (like giving out homework)
2. Lets **students** upload their code
3. **Automatically grades** the code and gives feedback!

It's like having a teaching assistant that never gets tired! ⚡

---

## 🏠 The Big Picture

Think of the app like a **house** with different rooms:

```
🏠 Code Grader App
├── 🚪 Front Door (Login/Register) - Who are you?
├── 🎛️ Control Room (Dashboard) - What do you want to do?
├── 📝 Teacher's Desk (Create Assignment) - Make homework
└── 📤 Student's Mailbox (Submit Assignment) - Turn in work
```

---

## 📁 Folder Structure Made Simple

```
frontend/
├── src/                      📦 All the code lives here!
│   ├── api/                  📡 Talks to the server
│   │   └── client.ts         🔌 The phone line to the backend
│   │
│   ├── components/           🧱 Reusable building blocks
│   │   └── ui/               🎨 Pretty buttons, cards, inputs
│   │
│   ├── context/              🧠 The app's memory
│   │   └── AuthContext.tsx   🔐 Remembers who logged in
│   │
│   ├── pages/                📄 The actual screens you see
│   │   ├── Login.tsx         🚪 Sign in page
│   │   ├── Register.tsx      ✍️ Sign up page
│   │   ├── Dashboard.tsx     🎛️ Main menu
│   │   ├── CreateAssignment.tsx  📝 (Teachers) Make homework
│   │   └── SubmitAssignment.tsx  📤 (Students) Turn in work
│   │
│   ├── App.tsx               🗺️ The map (which page goes where)
│   └── main.tsx              🚀 The launch button
│
└── package.json              📋 Shopping list of tools needed
```

---

## 🧩 Each Piece Explained

### 🔌 `api/client.ts` - The Messenger

**What it does**: Sends messages to the backend server (like sending a letter to a pen pal)

**Simple explanation**:
```
Your App  📱 ----sends request----> 🖥️ Backend Server
Your App  📱 <---gets response----- 🖥️ Backend Server
```

**Key features**:
- ✅ Automatically adds your login ticket (token) to every message
- 📍 Knows where the server lives (`http://localhost:8000`)

---

### 🧠 `context/AuthContext.tsx` - The Memory Keeper

**What it does**: Remembers if you're logged in, like a security guard's list! 🛡️

**It stores**:
| Thing | What it means |
|-------|---------------|
| `user` | Your info (email, role) |
| `token` | Your secret pass (like a wristband at a theme park) |

**Actions it can do**:
- 🔓 `login()` - Welcome you in!
- 🚪 `logout()` - Wave goodbye!

---

### 📄 Pages (The Screens You See)

#### 🚪 `Login.tsx` - The Front Door

**Simple version**: A form where you type your email and password to get in!

**What happens**:
1. You type email & password 📝
2. Press "Sign In" ▶️
3. App checks if you're allowed in ✅❌
4. If yes → Go to Dashboard! 🎉
5. If no → "Wrong password!" message 😢

---

#### ✍️ `Register.tsx` - The Sign-Up Sheet

**Simple version**: Create a new account if you don't have one!

**You pick**:
- Your email 📧
- Your password 🔑
- Your role: **Student** 🎒 or **Teacher** 👨‍🏫

---

#### 🎛️ `Dashboard.tsx` - The Control Room

**Simple version**: The main menu after you log in!

**What you see depends on WHO you are**:

| If you're a... | You can see... |
|----------------|----------------|
| 👨‍🏫 Teacher/Admin | "Create Assignment" + "Submit Solution" |
| 🎒 Student | "Submit Solution" only |

---

#### 📝 `CreateAssignment.tsx` - Making Homework (Teachers Only)

**Simple version**: Teachers use this to create coding problems!

**They fill in**:
1. **Title** - Name of the assignment ("Week 1: Arrays")
2. **Description** - What students need to do
3. **Grading Criteria** - How to grade the answer

**Result**: Gets a special **Assignment ID** (like `42`) to share with students!

---

#### 📤 `SubmitAssignment.tsx` - Turning In Work (Everyone)

**Simple version**: Upload your code and get a grade instantly! ⚡

**Steps**:
1. Enter the **Assignment ID** your teacher gave you
2. Upload your **code file** 📎
3. Click "Submit & Grade" 🚀
4. Wait for the robot to grade... ⏳
5. Get your **score out of 100** and **feedback**! 📊

---

### 🗺️ `App.tsx` - The Map

**Simple version**: Decides which page to show based on the URL!

```
URL                    →  Shows
──────────────────────────────────
/login                 →  Login page 🚪
/register              →  Register page ✍️
/dashboard             →  Dashboard 🎛️
/create-assignment     →  Create Assignment 📝
/submit-assignment     →  Submit Solution 📤
anything else          →  Redirect to Dashboard 🔄
```

**Important**: Most pages are **private** - you need to log in first! 🔐

---

## 🎭 User Roles

| Role | Can Do |
|------|--------|
| 🎒 **Student** | Login, Register, Submit Assignments |
| 👨‍🏫 **Teacher** | Everything a student can do + Create Assignments |
| 👑 **Admin** | Same as Teacher (superuser powers!) |

---

## 🛠️ Tech Stack (The Tools Used)

| Tool | What it does | ELI5 |
|------|-------------|------|
| ⚛️ React | Builds the UI | Like LEGO blocks for websites! |
| 📘 TypeScript | Adds types to JavaScript | Helps catch mistakes early! |
| ⚡ Vite | Development server | Makes coding fast! |
| 🎨 Tailwind CSS | Styling | Makes things pretty! |
| 📡 Axios | HTTP requests | The mailman! |
| 🎯 Lucide | Icons | Pretty pictures! |

---

## 🚀 How to Run It

```bash
# 1. Install the tools
npm install

# 2. Start the app
npm run dev

# 3. Open your browser
# Go to: http://localhost:5173
```

---

## 📊 Data Flow (How Info Moves Around)

```
     User Action
          ↓
    [React Page]  📄
          ↓
    [API Client]  📡  ──────→  Backend Server 🖥️
          ↓                           ↓
    [AuthContext] 🧠 ←──── JWT Token 🎫
          ↓
    [Update UI]  🎨
```

---

## ❓ FAQ (Frequently Asked Questions)

**Q: Why does my page redirect to login?**
> A: You're not logged in! The app protects pages with `PrivateRoute`.

**Q: What's a JWT token?**
> A: It's like a concert wristband - proves you bought a ticket (logged in)!

**Q: Why can't I create assignments?**
> A: Only teachers and admins can do that! Are you logged in as a student?

---

## 🎉 Summary

This is a **Code Grading App** that:

1. 🚪 Lets users **log in** with different roles
2. 👨‍🏫 Teachers **create assignments** with grading rules
3. 🎒 Students **submit their code**
4. 🤖 Backend **auto-grades** and gives **instant feedback**

Think of it as **Google Classroom meets auto-grader**! 📚✨

---

*Made with ❤️ for NACOS*
