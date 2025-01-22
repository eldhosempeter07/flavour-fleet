import React, { useEffect, useState } from "react";
import SignUp from "./components/signIn";
import Login from "./components/login";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./util/firebase";
import RestaurantItem from "./pages/restaurantItem";
// import logo from './logo.svg';

function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  console.log(user?.email);

  return (
    <div className="">
      Flavour Fleet
      {/* <SignUp /> */}
      <Routes>
        <Route path="/" element={user == null ? <Login /> : <Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantItem />} />
      </Routes>
    </div>
  );
}

export default App;
