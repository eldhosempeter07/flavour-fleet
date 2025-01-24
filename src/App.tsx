import React, { useContext } from "react";
import SignUp from "./components/signIn";
import Login from "./components/login";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import RestaurantItem from "./pages/restaurantItem";
import Cart from "./pages/cart";
import { AuthContext } from "./util/authContext";
import Checkout from "./pages/checkout";
import Success from "./pages/success";
import Profile from "./pages/profile";
// import logo from './logo.svg';

function App() {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  console.log(loading);

  return (
    <div className="">
      Flavour Fleet
      {/* <SignUp /> */}
      <Routes>
        <Route path="/" element={user == null ? <Login /> : <Home />} />

        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/cart/:id" element={<Cart />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/restaurant/:id" element={<RestaurantItem />} />
      </Routes>
    </div>
  );
}

export default App;
