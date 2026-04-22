import React from "react";
import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import AuthRedirect from "./components/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";

// Standard ecommerce imported pages
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Deals from "./pages/Deals";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/login" element={<AuthRedirect> <Login /> </AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect> <Register /> </AuthRedirect>} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;