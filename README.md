# Smart Multi-Agent Daily Planner 🚀

A modern, highly-interactive React application that acts as a central **Orchestrator Agent** to manage your daily tasks. Powered by a beautiful glassmorphic UI and an integrated AI (Google Gemini), it dynamically delegates your schedule across specialized virtual agents.

![Demo](./public/demo.webp)

## 🌟 Features

- **Multi-Agent Architecture**: 
  - 🤖 **Orchestrator Agent**: Your central command hub that talks to the AI and delegates tasks.
  - 🗓️ **Scheduling Agent**: Manages calendar events and blocks out time for meetings.
  - ✉️ **Communications Agent**: Prepares draft emails and summarizes messages.
  - ⛅ **Environment Agent**: Checks real-time weather alerts and travel disruptions.
  - 💼 **Deep Work Agent**: Dedicates focus time and silences distractions.
- **Smart AI Auto-Scheduling**: Click the **Auto-Schedule** button to have the AI instantly build an optimized, balanced day for you based on current context.
- **Interactive Chat Hub**: Use natural language to converse with your Orchestrator. Simply type *"Cancel my afternoon meetings and add a lunch break"* and watch the AI automatically update your task board!
- **Premium Glassmorphism UI**: Built with a sleek dark-mode glassmorphic aesthetic, vibrant gradients, and dynamic micro-animations.

## 🛠️ Technology Stack

- **Frontend**: React, Vite
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism, CSS Grid/Flexbox)
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (`@google/generative-ai`) via the `gemini-2.5-flash` model.

## 🚀 Getting Started

To run this project locally, follow these steps:

1. **Clone the repository** (or download the source):
   ```bash
   git clone <your-repo-url>
   cd smart-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:5173](http://localhost:5173) to see the app in action!

*(Note: The AI features rely on a Google Gemini API Key configured in the source code. Make sure your key is active and has access to the `gemini-2.5-flash` model).*

## 💡 How it works

The core AI logic is located in `src/App.jsx`. When a user requests an auto-schedule or sends a chat message, the React app sends a heavily engineered system prompt along with the user's input to the Gemini model. The model is constrained to return a strict JSON payload, which the UI parses to dynamically update the task list and provide conversational feedback.

---
*Created as an advanced iteration of the Kaggle Multi-Agent Daily Planner concept.*
