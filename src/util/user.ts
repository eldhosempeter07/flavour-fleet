import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { CartInfo, FoodItem, Order, Restaurant } from "./interface";

export const addToCart = async (
  id: string,
  count: number,
  resId: string,
  userId: string
) => {
  try {
    await addDoc(collection(db, "carts"), {
      itemId: id,
      count,
      restarantId: resId,
      userId,
    });

    console.log("Item added to cart");
  } catch (error) {
    console.log(error);
  }
};

export const getCartItems = async (userId: string) => {
  try {
    if (userId) {
      const uid = userId;
      const cartQuery = query(
        collection(db, "carts"),
        where("userId", "==", uid)
      );
      const cartSnapshot = await getDocs(cartQuery);
      const cartinfo = cartSnapshot.docs[0].data() as CartInfo;

      const itemDoc = await getDoc(doc(db, "foodItems", cartinfo.itemId));
      const restaurantDoc = await getDoc(
        doc(db, "restaurants", cartinfo.restarantId)
      );
      if (itemDoc.exists() && restaurantDoc.exists()) {
        const items = itemDoc.data() as FoodItem;
        const resturant = restaurantDoc.data() as Restaurant;

        const cartData = { cartinfo, items, resturant };

        return cartData;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (orderInfo: Order) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      orderInfo,
    });
    console.log(docRef.id);

    return docRef.id;
  } catch (error) {
    console.log(error);
  }
};
