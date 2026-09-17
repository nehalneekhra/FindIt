import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
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
import Search from "./pages/search";
import Notifications from "./pages/notifications";
import Settings from "./pages/settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/browse/:type" element={<Browse />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/item/:id" element={<ItemDetails />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/search" element={<Search />} />
      <Route path="/settings" element={<Settings />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {" "}
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report-lost"
        element={
          <ProtectedRoute>
            <ReportLost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report-found"
        element={
          <ProtectedRoute>
            <ReportFound />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
}

export default App;
