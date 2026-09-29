import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import LandingPage from "@/pages/LandingPage"
import CrimeDashboard from "@/pages/CrimeDashboard"
  

export type BarangayId =
  | "poblacion"
  | "mabayo"
  | "binaritan"
  | "sabang"
  | "nagbalayong";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<CrimeDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
