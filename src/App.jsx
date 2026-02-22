
import { Routes, Route, Link } from "react-router-dom";
import ChecklistPage from "./pages/ChecklistPage";
import AddItemPage from "./pages/AddItemPage";

function App() {

  return (
   <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between p-6 border-b border-white/10">
      
        <h1 className="font-bold">Hostel Prep</h1>
        <div className="space-x-6">
          <Link to="/">Checklist</Link>
          <Link to="/add">Add Item</Link>
          <Link
  to="/add"
  className="
    fixed bottom-6 right-6 z-50
    bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
    text-white w-16 h-16
    rounded-full flex items-center justify-center
    text-3xl shadow-2xl
    hover:scale-110 transition-transform
    md:hidden
  "
>
  +
</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ChecklistPage />} />
        <Route path="/add" element={<AddItemPage />} />
      </Routes>
    </div>

    
  );
}

export default App;