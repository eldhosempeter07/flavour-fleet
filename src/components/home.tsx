import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../util/firebase";
import { useNavigate } from "react-router-dom";
import RestaurantList from "../pages/restaurantList";

const Home = () => {
  return (
    <div>
      {/* <h5>Hey mf - {user?.email}</h5> */}
      <RestaurantList />
    </div>
  );
};

export default Home;
