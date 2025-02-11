import React, { createContext, ReactNode, useContext, useState } from "react";
import { Cart } from "../types";

interface CartContextType {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a CartProvider");
  }
  return context;
};
