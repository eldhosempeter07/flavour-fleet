import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { auth1 } from "../util/firebase";
import { AuthContext } from "../util/authContext";
import { Cart } from "../util/types";
import { getCartItems } from "../util/user";
import {
  getRestaurants,
  getRestaurantsByKeyword,
  getSearchKeywords,
} from "../util/userRestaurant";
import { useRestaurant } from "../util/restaurantContext";
import Next from "../assets/next.png";

const Header = () => {
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "No keyword provided";
  const handleLogout = () => {
    auth1.signOut();
    navigate("/");
  };
  const [keyWordsLoading, setKeyWordsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<Cart | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [keywords, setKeywords] = useState<string[] | null>(null);

  const fetchRestaurantsByKeyword = async () => {
    const restaurantInfo = await getRestaurantsByKeyword(keyword);
    setRestaurants(restaurantInfo);
  };

  useEffect(() => {
    if (keyword !== "No keyword provided") {
      fetchRestaurantsByKeyword();
    }
  }, []);

  const fetchCartItems = async () => {
    if (user?.uid) {
      const items = await getCartItems(user?.uid);
      setCartItems(items);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCartItems();
    }
  }, [user?.uid]);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { restaurants, setRestaurants } = useRestaurant();

  useEffect(() => {
    setKeyWordsLoading(true);
    const handleSearch = async () => {
      if (search !== "" && search.length > 2) {
        const keywords = await getSearchKeywords(search);
        setKeywords(keywords);
        setKeyWordsLoading(false);
      }
    };

    if (search.length < 3) {
      setKeywords(null);
    }

    setTimeout(() => {
      handleSearch();
    }, 2000);
  }, [search]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeywords = async (keyword: string) => {
    const restaurantInfo = await getRestaurantsByKeyword(keyword);
    setRestaurants(restaurantInfo);
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setKeywords(null);
    setSearch("");
  };

  console.log(keyWordsLoading, search.length, keywords);

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
          className="text-orange-500 font-bold hover:text-orange-600"
        >
          {isMenuOpen ? "✖" : "☰"} {/* Toggle Menu Icon */}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex space-x-5 mr-5">
        {location.pathname === "/" || location.pathname === "/search" ? (
          <div className="relative">
            <input
              placeholder="Search Flavour Fleet"
              className="rounded-2xl  focus:outline-none bg-gray-100 text-gray-900 placeholder:text-black text-sm w-96 py-2 px-2"
              onClick={() => {
                isOpen === true && setIsOpen(false);
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {keywords !== null && search.length > 2 ? (
              <div className="absolute left-0 top-6  mt-4 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {keywords.map((keyword) => (
                  <div
                    className="border-[0.1rem] cursor-pointer border-gray-100 py-2 flex justify-between"
                    onClick={() => handleKeywords(keyword)}
                  >
                    <h4 className="ml-3">{keyword} </h4>
                    <img src={Next} alt="next" className=" mr-3 w-5 h-5" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {user?.uid ? (
          <>
            <div className="relative">
              {/* Dropdown Toggle Button */}
              <button
                onClick={toggleDropdown}
                className="flex items-center text-orange-500 hover:text-orange-600 font-semibold uppercase focus:outline-none"
              >
                {user.email?.slice(0, 1)}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-[-2rem] mt-4 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href={`/profile/${user?.uid}`}
                  >
                    Profile
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href={`/address/${user?.uid}`}
                  >
                    Address
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href={`/card/${user?.uid}`}
                  >
                    Payment
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href={`/orders/${user?.uid}`}
                  >
                    Orders
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

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
            <div className="relative">
              <input
                placeholder="Search Flavour Fleet"
                className="rounded-2xl  focus:outline-none bg-gray-100 text-gray-900 placeholder:text-black text-sm w-full py-2 px-2"
                onClick={() => {
                  isOpen === true && setIsOpen(false);
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {keywords !== null &&
              keywords?.length > 0 &&
              search.length > 2 ? (
                <div className="absolute left-0 top-6  mt-4 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {keywords.map((keyword) => (
                    <div
                      className="border-[0.1rem] cursor-pointer border-gray-100 py-2 flex justify-between"
                      onClick={() => handleKeywords(keyword)}
                    >
                      <h4 className="ml-3">{keyword} </h4>
                      <img src={Next} alt="next" className=" mr-3 w-5 h-5" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
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
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  href={`/card/${user?.uid}`}
                >
                  Payment
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
