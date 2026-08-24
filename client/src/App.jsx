import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import SocketTest from "./pages/chat/SocketTest";

function App() {
  const [count, setCount] = useState(0)

  return (
       <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<h1>TripMate</h1>}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/socket-test"
                    element={<SocketTest />}
                />
            </Routes>
        </BrowserRouter>
  );
}

export default App
