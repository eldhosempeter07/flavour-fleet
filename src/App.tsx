import React, { useContext } from "react";
import SignUp from "./components/signUp";
import Login from "./components/login";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import RestaurantItem from "./pages/restaurantItem";
import Cart from "./pages/cart";
import { AuthContext } from "./util/context/authContext";
import Checkout from "./pages/checkout";
import Success from "./pages/success";
import Profile from "./pages/profile";
import Orders from "./pages/orders";
import Address from "./pages/address";
import Header from "./components/header";
import AuthRouter from "./util/authRouter";
import LoadingScreen from "./components/loadingScreen";
import Payment from "./pages/payment";

function App() {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  if (loading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Home />} />

        <Route
          path="/register"
          element={user == null ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={user == null ? <Login /> : <Navigate to="/" />}
        />

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
        <Route
          path="/card/:id"
          element={<AuthRouter element={<Payment />} />}
        />
      </Routes>
    </>
  );
}

export default App;
