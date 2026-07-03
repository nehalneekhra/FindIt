import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Browse from "./pages/browse";
import ReportLost from "./pages/reportlost";
import ReportFound from "./pages/reportfound";
import ItemDetails from "./pages/itemdetails";
import Profile from "./pages/profile";
import NotFound from "./pages/notfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/browse/:type" element={<Browse />} />
      <Route path="/report-lost" element={<ReportLost />} />
      <Route path="/report-found" element={<ReportFound />} />
      <Route path="/item/:id" element={<ItemDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;