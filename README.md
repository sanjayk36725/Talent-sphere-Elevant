<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" alt="NeoExamShield Banner" width="1200" height="475" />
</div>

# NeoExamShield 🛡️

A next-generation, high-security online examination platform with built-in advanced proctoring capabilities. Built with React, TypeScript, and powered by Gemini AI, it ensures academic integrity through real-time monitoring and strict protocol enforcement.

## ✨ Features

- **Advanced Proctoring System (`NeoExamShield`)**
  - **Live Camera & Face Detection:** Continuously monitors the test-taker to ensure their face is clearly visible.
  - **Audio & Microphone Monitoring:** Real-time microphone level sensing to detect suspicious ambient sounds or talking.
  - **Strict Protocol Enforcement:** Disables right-click, copy, paste, and text selection.
  - **Tab & Window Focus Lock:** Detects if the user leaves the fullscreen mode or switches tabs, triggering automatic warnings.
  - **Extension Integration:** Requires a verified Chrome extension to ensure a tamper-proof environment.
  - **Three-Strike Warning System:** Automatically terminates and submits the exam if the user violates protocols 3 times.

- **AI-Powered Evaluation**
  - Integrates `@google/genai` to analyze exam responses, provide insights, or generate questions dynamically.

- **Rich, Interactive UI**
  - Beautiful dashboards powered by `tailwindcss` and `framer-motion` (Motion).
  - Data visualization using `recharts`.
  - Iconography provided by `lucide-react`.

- **Comprehensive Exam Delivery**
  - Supports detailed MCQ rendering.
  - Built-in PDF generation for reports using `jspdf` and `jspdf-autotable`.
  - Automatic email notifications using `nodemailer` and `express`.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS 4.1
- **Backend/Scripts:** Node.js, Express, TSX, esbuild
- **AI Integration:** Google Gemini AI API (`@google/genai`)
- **Styling & Animations:** TailwindCSS, Motion
- **Utilities:** Lucide React (Icons), Recharts (Charts), jsPDF (PDF export)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd MILESTONE4
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (you can use `.env.example` as a template) and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The app will start on the default Vite port (usually `http://localhost:5173`).

### Production Build
To build the project for production:
```bash
npm run build
```
To start the built server:
```bash
npm start
```

## 🔒 Proctoring Flow

1. The student navigates to the exam URL.
2. The `NeoExamShield` component initializes.
3. The student is prompted to authorize Camera and Microphone permissions.
4. The system verifies if the NeoExamShield Chrome Extension is installed.
5. The student clicks "Start Examination & Lock Fullscreen".
6. The test begins in a locked environment. Any deviation (tab switch, face lost, copy/paste) issues a warning.

---

*This project was bootstrapped using Vite and integrates with Google AI Studio.*
