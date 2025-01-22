import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../util/firebase";
import { useNavigate } from "react-router-dom";
import RestaurantList from "../pages/restaurantList";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
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

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };
  return (
    <div>
      <div className="text-right mr-5">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h5>Hey mf - {user?.email}</h5>
      <RestaurantList />
    </div>
  );
};

export default Home;
