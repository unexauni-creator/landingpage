import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import "./styles/landing.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}
