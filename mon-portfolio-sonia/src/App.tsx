import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPage from "./pages/PublicPage";
import AdminPage from "./pages/AdminPage";
import ProjectDetail from "./pages/ProjectDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/*" element={<PublicPage />} />
      </Routes>
    </BrowserRouter>
  );
}