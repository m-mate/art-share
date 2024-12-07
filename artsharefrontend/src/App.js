import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import GalleryPage from "./components/GalleryPage";
import AddPaintingPage from "./components/AddPaintingPage.js";
import UpdateUserPage from "./components/UpdateUserPage.js";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import EditPaintingPage from "./components/EditPaintingPage";
import UsersPage from "./components/UsersPage.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route
          path="/update-user"
          element={
            <PrivateRoute element={UpdateUserPage} requireAdmin={false} />
          }
        />
        <Route
          path="/gallery"
          element={<PrivateRoute element={GalleryPage} requireAdmin={false} />}
        />
        <Route
          path="/add-painting"
          element={
            <PrivateRoute element={AddPaintingPage} requireAdmin={false} />
          }
        />
        <Route
          path="/edit-painting/:paintingId"
          element={
            <PrivateRoute element={EditPaintingPage} requireAdmin={false} />
          }
        />

        <Route
          path="/users"
          element={<PrivateRoute element={UsersPage} requireAdmin={true} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
