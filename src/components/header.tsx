import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth1 } from "../util/firebase";
import { AuthContext } from "../util/authContext";

const Header = () => {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    auth1.signOut();
    navigate("/login");
  };
  return (
    <div className="flex justify-between mt-4">
      <div className="ml-5">
        <a href="/home" className="font-bold text-orange-500 uppercase text-lg">
          Flavour Fleet
        </a>
      </div>
      {user?.uid ? (
        <div className="text-right mr-5">
          <a
            className="mr-3 text-orange-500 font-semibold uppercase"
            href={`/profile/${user?.uid}`}
          >
            Profile
          </a>
          <a
            className="mr-3 text-orange-500 font-semibold uppercase"
            href={`/address/${user?.uid}`}
          >
            Address
          </a>
          <a
            className="mr-3 text-orange-500 font-semibold uppercase"
            href={`/orders/${user?.uid}`}
          >
            Orders
          </a>
          <button
            onClick={handleLogout}
            className="text-orange-500 font-semibold uppercase"
          >
            Logout
          </button>
          <a
            href={`/cart/${user?.uid}`}
            className="ml-3  text-orange-500 font-semibold uppercase cursor-pointer"
          >
            Cart
          </a>
        </div>
      ) : (
        <div className="text-right mr-5">
          <a
            className="mr-3  font-semibold uppercase cursor-pointer text-orange-500"
            href={`/login`}
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Header;
