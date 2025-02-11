import React, { createContext, ReactNode, useContext, useState } from "react";
import { Restaurant } from "../types";

interface RestaurantContextType {
  restaurants: Restaurant[] | null;
  setRestaurants: (restaurants: Restaurant[] | null) => void;
}

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantContext = createContext<
  RestaurantContextType | undefined
>(undefined);

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({
  children,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  return (
    <RestaurantContext.Provider value={{ restaurants, setRestaurants }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
