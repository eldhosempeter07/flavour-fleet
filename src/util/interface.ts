export type FoodItem = {
  category: string;
  description: string;
  imageURL: string;
  name: string;
  price: number;
  rating: number;
  restaurantId: string;
};

export type Restaurant = {
  id: string;
  email: string;
  image: string;
  location: string;
  name: string;
  phone?: number;
  type: string;
  menu?: string[];
  menuItems?: FoodItem[];
  timing?: { close: string; day: string; holiday: boolean; open: string }[];
};
