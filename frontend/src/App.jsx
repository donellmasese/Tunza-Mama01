import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FindCounsellor from "./pages/FindCounsellor";
import WomanDashboard from "./pages/WomanDashboard";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counsellors" element={<FindCounsellor />} />
        <Route path="/woman-dashboard" element={<WomanDashboard />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}