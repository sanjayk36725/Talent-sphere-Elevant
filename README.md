<div align="center">
🛡️ NeoExamShield
Next-Gen AI-Powered Secure Examination Platform
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=22D3EE&center=true&vCenter=true&width=600&lines=Real-Time+Proctoring+Engine;Face+%2B+Audio+Detection;AI-Powered+Evaluation+with+Gemini;Tamper-Proof+Exam+Environment" alt="Typing SVG" />

Show Image Show Image Show Image Show Image Show Image Show Image

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:22D3EE,100:6366F1&height=120&section=header" width="100%"/> </div>
📚 Table of Contents
Features
Tech Stack
Getting Started
Environment Variables
Available Scripts
Proctoring Flow
Project Structure
Contributing
License
✨ Features
Advanced Proctoring System
Capability	Description
Live Camera & Face Detection	Continuously monitors test-taker; ensures face stays visible.
Audio & Microphone Monitoring	Real-time mic level sensing catches ambient noise or talking.
Strict Protocol Enforcement	Disables right-click, copy, paste, text selection.
Tab & Window Focus Lock	Detects fullscreen exit or tab switch; triggers auto warning.
Extension Integration	Requires verified Chrome extension for tamper-proof setup.
Three-Strike Warning System	Auto-terminates + auto-submits exam after 3 violations.
AI-Powered Evaluation

Uses @google/genai to analyze responses, surface insights, generate questions dynamically.

Rich, Interactive UI
Dashboards via TailwindCSS + Framer Motion
Charts via Recharts
Icons via Lucide React
Comprehensive Exam Delivery
Detailed MCQ rendering
PDF reports via jsPDF + jsPDF-AutoTable
Auto email notifications via Nodemailer + Express
🛠️ Tech Stack
<div align="center">

Show Image Show Image Show Image Show Image Show Image Show Image Show Image

</div>
Layer	Technologies
Frontend	React 19, TypeScript, Vite, TailwindCSS 4.1
Backend/Scripts	Node.js, Express, TSX, esbuild
AI Integration	Google Gemini AI API (@google/genai)
Styling & Animation	TailwindCSS, Motion
Utilities	Lucide React (icons), Recharts (charts), jsPDF (PDF export)
🚀 Getting Started
Prerequisites
Node.js v18+
Google Gemini API Key
Installation
bash
git clone <your-repository-url>
cd MILESTONE4
npm install
Environment Setup

Create .env in root (use .env.example as template):

env
GEMINI_API_KEY=your_api_key_here
Run Dev Server
bash
npm run dev

App runs on default Vite port — usually http://localhost:5173.

Production Build
bash
npm run build
npm start
🔑 Environment Variables
Variable	Required	Description
GEMINI_API_KEY	✅	API key for Google Gemini AI integration
📜 Available Scripts
Script	Description
npm run dev	Starts Vite dev server
npm run build	Builds app for production
npm start	Starts production server
🔒 Proctoring Flow
No
Yes
Yes
Yes
No
No
Student opens exam URL
NeoExamShield componentinitializes
Camera + Microphonepermission prompt
Chrome Extension verified?
Block start
Click 'Start Examination &Lock Fullscreen'
Exam runs in lockedenvironment
Violation detected?tab switch / face lost /copy-paste
Issue warning +1
3 warnings reached?
Auto-terminate +auto-submit
Student navigates to exam URL.
NeoExamShield component initializes.
Student authorizes Camera and Microphone.
System verifies NeoExamShield Chrome Extension installed.
Student clicks "Start Examination & Lock Fullscreen".
Exam runs locked — any deviation issues warning.
After 3 warnings → auto-terminate + auto-submit.
📁 Project Structure
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
🤝 Contributing
Fork repo
Branch: git checkout -b feature/your-feature
Commit: git commit -m 'Add feature'
Push: git push origin feature/your-feature
Open Pull Request
📄 License

MIT — see LICENSE file.

<div align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,100:22D3EE&height=100&section=footer" width="100%"/>

Built with 🛡️ for academic integrity

</div>
