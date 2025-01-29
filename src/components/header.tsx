import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../util/firebase";
import { AuthContext } from "../util/authContext";

const Header = () => {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };
  return (
    <div>
      <div className="text-right mr-5">
        <a className="mr-3" href={`/profile/${user?.uid}`}>
          Profile
        </a>{" "}
        <a className="mr-3" href={`/address/${user?.uid}`}>
          Address
        </a>
        <a className="mr-3" href={`/orders/${user?.uid}`}>
          Orders
        </a>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
