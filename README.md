# 🕸️ MERN Stack Graph Visualizer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-success?style=for-the-badge)](https://graph-visualizer-azure.vercel.app/)

An interactive web application built with the MERN stack that allows users to construct graphs (nodes and edges) and visualize standard graph algorithms step-by-step.

## 🚀 Live URL
**[https://graph-visualizer-azure.vercel.app/](https://graph-visualizer-azure.vercel.app/)**

## ✨ Features
- **Interactive UI**: Define the number of nodes and edge connections using a simple text input format.
- **Algorithm Animation**: Visualizes Breadth-First Search (BFS), Depth-First Search (DFS), and Dijkstra's Algorithm in real-time.
- **Step-by-Step Execution**: Built using JavaScript Generator functions (`function*`) to smoothly pause and animate algorithm states without blocking the UI.
- **Persistent Storage**: Save your custom-built graph structures to a MongoDB database and load them later.
- **Custom Built**: SVG rendering engine built entirely from scratch inside React without relying on heavy canvas libraries.

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS v4
- Lucide React (Icons)
- HTML5 SVG

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- CORS & Dotenv

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SATYA-png400/Graph-visualizer.git
   cd Graph-visualizer
   ```

2. **Start the application:**
   If you are on Windows, simply double click the `start.bat` file to automatically install dependencies and run both servers simultaneously.
   
   *Alternatively, you can run them manually:*
   - **Frontend**: `cd frontend` -> `npm install` -> `npm run dev`
   - **Backend**: `cd backend` -> `npm install` -> `node server.js`
