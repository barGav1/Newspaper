import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Default from "./pages/Default";
import Upload from "./pages/Upload";
import LinksList from "./pages/LinksList";
import Delete from "./pages/Delete";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Delete" element={<Delete />} />
        <Route path="/class/:classId/subject/:subjectId/info/:infoId" element={<LinksList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;