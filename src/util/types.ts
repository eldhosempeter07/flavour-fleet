export type FoodItem = {
  id: string;
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

export type CartInfo = {
  count: number;
  itemId: string;
  restarantId: string;
  userId: string;
};

export type Cart = {
  cartinfo: CartInfo;
  items: FoodItem;
  resturant: Restaurant;
};

export type Fees = {
  tax: string;
  deliveryFee: string;
  subTotal: string;
};

export type Order = {
  addressId: string;
  fees: Fees;
  instruction: string;
  payId: string;
  userId: string;
  orderItems: string[];
};

export type userOrders = {
  id: string;
  orderInfo: Order;
  items: FoodItem[];
};

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type AddressType = {
  id?: string;
  userId?: string;
  street: string;
  city: string;
  phone: string;
  zipcode: string;
  fullName: string;
};
