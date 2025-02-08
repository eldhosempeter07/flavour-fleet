export type Categories = {
  name: string;
  id: string;
};

export type FoodItem = {
  id: string;
  category: string;
  description: string;
  imageURL: string;
  name: string;
  price: number;
  rating: number;
  restaurantId: string;
  count?: number;
  ingredients: string;
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
  rating: string;
};

export type CartItem = {
  count: number;
  itemId: string;
};

export type CartInfo = {
  items: CartItem[];
  restarantId: string;
  userId: string;
};

export type Cart = {
  cartinfo: CartInfo;
  items: FoodItem[];
  resturant: Restaurant | null;
  totalAmount: number;
  count?: number;
};

export type Fees = {
  tax: string;
  deliveryFee: string;
  subTotal: string;
  total: string;
};

export type OrderItems = {
  itemId: string;
  count: number;
};

export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export type Order = {
  createdAt: Date | Timestamp;
  addressId: string;
  restaurantId: string;
  fees: Fees;
  instruction: string;
  payId: string;
  userId: string;
  orderItems: OrderItems[];
  status: string;
};

export type userOrders = {
  id: string;
  orderInfo: Order;
  items: FoodItem[];
  totalCount?: number;
  restaurant?: Restaurant;
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

export type CardType = {
  id?: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv?: number;
  userId?: string;
  zipcode: string;
};
