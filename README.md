<div align="center">

# 🛡️ NeoExamShield

### Next-Gen AI-Powered Secure Examination Platform

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=22D3EE&center=true&vCenter=true&width=600&lines=Real-Time+Proctoring+Engine;Face+%2B+Audio+Detection;AI-Powered+Evaluation+with+Gemini;Tamper-Proof+Exam+Environment" alt="Typing SVG" />

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-strict-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/vite-powered-646cff?logo=vite)
![Gemini](https://img.shields.io/badge/AI-Gemini-8E75B2?logo=googlegemini)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:22D3EE,100:6366F1&height=120&section=header" width="100%"/>

</div>

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Proctoring Flow](#-proctoring-flow)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Advanced Proctoring System

| Capability | Description |
|---|---|
| **Live Camera & Face Detection** | Continuously monitors test-taker; ensures face stays visible. |
| **Audio & Microphone Monitoring** | Real-time mic level sensing catches ambient noise or talking. |
| **Strict Protocol Enforcement** | Disables right-click, copy, paste, text selection. |
| **Tab & Window Focus Lock** | Detects fullscreen exit or tab switch; triggers auto warning. |
| **Extension Integration** | Requires verified Chrome extension for tamper-proof setup. |
| **Three-Strike Warning System** | Auto-terminates + auto-submits exam after 3 violations. |

### AI-Powered Evaluation
Uses `@google/genai` to analyze responses, surface insights, generate questions dynamically.

### Rich, Interactive UI
- Dashboards via **TailwindCSS** + **Framer Motion**
- Charts via **Recharts**
- Icons via **Lucide React**

### Comprehensive Exam Delivery
- Detailed MCQ rendering
- PDF reports via **jsPDF** + **jsPDF-AutoTable**
- Auto email notifications via **Nodemailer** + **Express**

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/-React_19-black?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/-TypeScript-black?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/-Vite-black?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS_4.1-black?style=flat-square&logo=tailwindcss)
![Node.js](https://img.shields.io/badge/-Node.js-black?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/-Express-black?style=flat-square&logo=express)
![Gemini](https://img.shields.io/badge/-Gemini_AI-black?style=flat-square&logo=googlegemini)

</div>

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS 4.1 |
| **Backend/Scripts** | Node.js, Express, TSX, esbuild |
| **AI Integration** | Google Gemini AI API (`@google/genai`) |
| **Styling & Animation** | TailwindCSS, Motion |
| **Utilities** | Lucide React (icons), Recharts (charts), jsPDF (PDF export) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Google Gemini API Key

### Installation

```bash
git clone <your-repository-url>
cd MILESTONE4
npm install
```

### Environment Setup

Create `.env` in root (use `.env.example` as template):

```env
GEMINI_API_KEY=your_api_key_here
```

### Run Dev Server

```bash
npm run dev
```

App runs on default Vite port — usually `http://localhost:5173`.

### Production Build

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | API key for Google Gemini AI integration |

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts Vite dev server |
| `npm run build` | Builds app for production |
| `npm start` | Starts production server |

---

## 🔒 Proctoring Flow

```mermaid
flowchart TD
    A[Student opens exam URL] --> B[NeoExamShield component initializes]
    B --> C[Camera + Microphone permission prompt]
    C --> D{Chrome Extension verified?}
    D -- No --> E[Block start]
    D -- Yes --> F[Click 'Start Examination & Lock Fullscreen']
    F --> G[Exam runs in locked environment]
    G --> H{Violation detected?<br/>tab switch / face lost / copy-paste}
    H -- Yes --> I[Issue warning +1]
    I --> J{3 warnings reached?}
    J -- Yes --> K[Auto-terminate + auto-submit]
    J -- No --> G
    H -- No --> G
```

1. Student navigates to exam URL.
2. `NeoExamShield` component initializes.
3. Student authorizes **Camera** and **Microphone**.
4. System verifies **NeoExamShield Chrome Extension** installed.
5. Student clicks **"Start Examination & Lock Fullscreen"**.
6. Exam runs locked — any deviation issues warning.
7. After **3 warnings** → auto-terminate + auto-submit.

---

## 📁 Project Structure

```
MILESTONE4/
├── src/
│   ├── components/     # React components (NeoExamShield, MCQ renderer, dashboards)
│   ├── hooks/          # Custom hooks (camera, mic, focus-lock)
│   ├── services/       # Gemini AI, PDF, email services
│   └── ...
├── server/              # Express backend
├── .env.example
├── package.json
└── README.md
```

---

## 🤝 Contributing

1. Fork repo
2. Branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

---

## 📄 License

MIT — see `LICENSE` file.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,100:22D3EE&height=100&section=footer" width="100%"/>

**Built with 🛡️ for academic integrity**

</div>
