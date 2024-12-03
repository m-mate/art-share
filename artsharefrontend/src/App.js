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
          element={<PrivateRoute element={UpdateUserPage} />}
        />
        <Route
          path="/gallery"
          element={<PrivateRoute element={GalleryPage} />}
        />
        <Route path="/users" element={<PrivateRoute element={UsersPage} />} />
        <Route
          path="/add-painting"
          element={<PrivateRoute element={AddPaintingPage} />}
        />
        <Route
          path="/edit-painting/:paintingId"
          element={<PrivateRoute element={EditPaintingPage} />}
        />

        <Route
          path="/update-user/*"
          element={<PrivateRoute element={UpdateUserPage} />}
        />
        <Route
          path="/gallery/*"
          element={<PrivateRoute element={GalleryPage} />}
        />
        <Route
          path="/add-painting/*"
          element={<PrivateRoute element={AddPaintingPage} />}
        />
        <Route path="/*" element={<PrivateRoute />} />
      </Routes>
    </Router>
  );
};

export default App;
