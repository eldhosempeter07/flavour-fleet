import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { auth1 } from "../util/firebase";
import { AuthContext } from "../util/context/authContext";
import { getCartItems } from "../util/user";
import {
  getRestaurantsByKeyword,
  getSearchKeywords,
} from "../util/userRestaurant";
import { useRestaurant } from "../util/context/restaurantContext";
import { useCart } from "../util/context/cartContext";
import { ShoppingCart } from "lucide-react";
import { useDebounce } from "../util/hooks/useDebounce";
import KeywordDropdown from "./keywordDropdown";

const Header = () => {
  const { user } = useContext(AuthContext) ?? { user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "No keyword provided";

  const { cart, setCart } = useCart();
  const { restaurants, setRestaurants } = useRestaurant();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [keywords, setKeywords] = useState<string[] | null>(null);
  const [keyWordsLoading, setKeyWordsLoading] = useState(false);

  const handleLogout = () => {
    auth1.signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchRestaurantsByKeyword = async () => {
      const restaurantInfo = await getRestaurantsByKeyword(keyword);
      setRestaurants(restaurantInfo);
    };
    if (keyword !== "No keyword provided") {
      fetchRestaurantsByKeyword();
    }
  }, [keyword, setRestaurants]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user?.uid) {
        const items = await getCartItems(user.uid);
        setCart(items ?? null);
      }
    };
    fetchCartItems();
  }, [user?.uid, setCart]);

  useEffect(() => {
    const fetchKeywords = async () => {
      if (debouncedSearch.length >= 1) {
        setKeyWordsLoading(true);
        const result = await getSearchKeywords(debouncedSearch);
        setKeywords(result);
        setKeyWordsLoading(false);
      } else {
        setKeywords(null);
      }
    };
    fetchKeywords();
  }, [debouncedSearch]);

  const handleKeywords = async (keyword: string) => {
    const restaurantInfo = await getRestaurantsByKeyword(keyword);
    setRestaurants(restaurantInfo);
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setKeywords(null);
    setSearch("");
  };

  return (
    <div className="flex md:flex-row justify-between items-center mt-4 px-4 sm:px-6 lg:px-8">
      <div className="ml-5">
        <a
          href="/"
          className="font-bold text-orange-500 hover:text-orange-600 uppercase text-lg"
        >
          Flavour Fleet
        </a>
      </div>
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-orange-500 font-bold hover:text-orange-600"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex space-x-5 mr-5">
        {(location.pathname === "/" || location.pathname === "/search") && (
          <div className="relative">
            <input
              placeholder="Search Flavour Fleet"
              className="rounded-2xl bg-gray-100 text-gray-900 placeholder:text-black text-sm w-96 py-2 px-2 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <KeywordDropdown
              keywords={keywords}
              loading={keyWordsLoading}
              search={search}
              onSelect={handleKeywords}
            />
          </div>
        )}
        {user?.uid ? (
          <>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-orange-500 hover:text-orange-600 font-semibold uppercase"
              >
                {user.email?.[0]}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isOpen ? "rotate-180" : ""
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
              {isOpen && (
                <div className="absolute right-[-2rem] mt-4 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {["profile", "address", "card", "orders"].map((item) => (
                    <a
                      key={item}
                      href={`/${item}/${user.uid}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </a>
                  ))}
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
                href={`/cart/${user.uid}`}
                className="text-orange-500 hover:text-orange-600 font-semibold uppercase cursor-pointer"
              >
                <span className="bg-orange-500 rounded-full px-[0.3rem] text-white text-[0.8rem] absolute top-[-0.6rem] right-[-0.5rem]">
                  {cart?.count}
                </span>
                <ShoppingCart size={20} />
              </a>
            </div>
          </>
        ) : (
          <a
            href="/login"
            className="text-right font-semibold uppercase cursor-pointer text-orange-500 hover:text-orange-600"
          >
            Login
          </a>
        )}
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-12 left-0 w-full bg-white shadow-md z-50">
          <div className="flex flex-col items-center space-y-4 py-4">
            {(location.pathname === "/" || location.pathname === "/search") && (
              <div className="relative">
                <input
                  placeholder="Search Flavour Fleet"
                  className="rounded-2xl bg-gray-100 text-gray-900 placeholder:text-black text-sm w-96 py-2 px-2 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <KeywordDropdown
                  keywords={keywords}
                  loading={keyWordsLoading}
                  search={search}
                  onSelect={handleKeywords}
                />
              </div>
            )}
            {user?.uid ? (
              <>
                {["profile", "address", "card", "orders"].map((item) => (
                  <a
                    key={item}
                    href={`/${item}/${user.uid}`}
                    className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
                >
                  Logout
                </button>
                <div className="relative inline">
                  <a
                    href={`/cart/${user.uid}`}
                    className="text-orange-500 hover:text-orange-600 font-semibold uppercase cursor-pointer"
                  >
                    <span className="bg-orange-500 rounded-full px-[0.3rem] text-white text-[0.8rem] absolute top-[-0.4rem] right-[-0.7rem]">
                      {cart?.count}
                    </span>
                    <ShoppingCart size={20} />
                  </a>
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="text-orange-500 hover:text-orange-600 font-semibold uppercase"
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
