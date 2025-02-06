import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth1 } from "../util/firebase";
import { AuthContext } from "../util/authContext";
import { Cart } from "../util/types";
import { getCartItems } from "../util/user";

const Header = () => {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    auth1.signOut();
    navigate("/");
  };

  const [cartItems, setCartItems] = useState<Cart | undefined>(undefined);

  const fetchCartItems = async () => {
    if (user?.uid) {
      const items = await getCartItems(user?.uid);
      console.log(items);
      setCartItems(items);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCartItems();
    }
  }, [user?.uid]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mt-4 px-4 sm:px-6 lg:px-8">
      <div className="ml-5">
        <a
          href="/"
          className="font-bold text-orange-500 hover:text-orange-600 uppercase text-lg"
        >
          Flavour Fleet
        </a>
      </div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-orange-500 hover:text-orange-600"
        >
          {isMenuOpen ? "✖" : "☰"} {/* Toggle Menu Icon */}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex space-x-5 mr-5">
        {user?.uid ? (
          <>
            <a
              className="text-right text-[1rem] text-orange-500 hover:text-orange-600 font-semibold uppercase"
              href={`/profile/${user?.uid}`}
            >
              Profile
            </a>
            <a
              className="text-right text-orange-500 hover:text-orange-600 font-semibold uppercase"
              href={`/address/${user?.uid}`}
            >
              Address
            </a>
            <a
              className="text-right text-orange-500 hover:text-orange-600 font-semibold uppercase"
              href={`/orders/${user?.uid}`}
            >
              Orders
            </a>
            <button
              onClick={handleLogout}
              className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
            >
              Logout
            </button>
            <div className="relative inline">
              <a
                href={`/cart/${user?.uid}`}
                className="text-orange-500 hover:text-orange-600 font-semibold uppercase cursor-pointer"
              >
                <span className="bg-orange-500 rounded-full px-[0.3rem] text-white text-[0.8rem] absolute top-[-0.4rem] right-[-0.7rem]">
                  {cartItems?.count}
                </span>
                🛒
              </a>
            </div>
          </>
        ) : (
          <a
            className="text-right font-semibold uppercase cursor-pointer text-orange-500 hover:text-orange-600"
            href={`/login`}
          >
            Login
          </a>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-12 left-0 w-full bg-white shadow-md z-50">
          <div className="flex flex-col items-center space-y-4 py-4">
            {user?.uid ? (
              <>
                <a
                  className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                  href={`/profile/${user?.uid}`}
                >
                  Profile
                </a>
                <a
                  className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                  href={`/address/${user?.uid}`}
                >
                  Address
                </a>
                <a
                  className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                  href={`/orders/${user?.uid}`}
                >
                  Orders
                </a>
                <button
                  onClick={handleLogout}
                  className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                >
                  Logout
                </button>
                <div className="relative inline">
                  <a
                    href={`/cart/${user?.uid}`}
                    className="text-orange-500 hover:text-orange-600 font-semibold uppercase cursor-pointer"
                  >
                    <span className="bg-orange-500 rounded-full px-[0.3rem] text-white text-[0.8rem] absolute  top-[-0.4rem] right-[-0.7rem]">
                      {cartItems?.count}
                    </span>
                    🛒
                  </a>
                </div>
              </>
            ) : (
              <a
                className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                href={`/login`}
              >
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
