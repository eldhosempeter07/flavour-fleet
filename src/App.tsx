import React, { useContext } from "react";
import SignUp from "./components/signUp";
import Login from "./components/login";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import RestaurantItem from "./pages/restaurantItem";
import Cart from "./pages/cart";
import { AuthContext } from "./util/authContext";
import Checkout from "./pages/checkout";
import Success from "./pages/success";
import Profile from "./pages/profile";
import Orders from "./pages/orders";
import Address from "./pages/address";
import Header from "./components/header";
import AuthRouter from "./util/authRouter";

function App() {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  if (loading) {
    return <div>Loading ...</div>;
  }
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/register"
          element={user == null ? <SignUp /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={user == null ? <Login /> : <Navigate to="/home" />}
        />

        {/* <Route path="/home" element={<Home />} /> */}

        <Route
          path="/profile/:id"
          element={<AuthRouter element={<Profile />} />}
        />
        <Route path="/cart/:id" element={<AuthRouter element={<Cart />} />} />
        <Route
          path="/checkout/:id"
          element={<AuthRouter element={<Checkout />} />}
        />
        <Route
          path="/success/:id"
          element={<AuthRouter element={<Success />} />}
        />
        <Route path="/restaurant/:id" element={<RestaurantItem />} />
        <Route
          path="/orders/:id"
          element={<AuthRouter element={<Orders />} />}
        />
        <Route
          path="/address/:id"
          element={<AuthRouter element={<Address />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
