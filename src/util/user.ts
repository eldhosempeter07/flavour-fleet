import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  AddressType,
  CartInfo,
  FoodItem,
  Order,
  Restaurant,
  userOrders,
} from "./types";
import { getMenuItems } from "./userRestaurant";

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
    const userId = orderInfo.userId;
    if (docRef.id) {
      const userQuery = query(
        collection(db, "carts"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "carts", document.id));
      });
      return docRef.id;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async (
  userId: string
): Promise<userOrders[] | null> => {
  const ordersQuery = query(
    collection(db, "orders"),
    where("orderInfo.userId", "==", userId)
  );

  const querySnapshot = await getDocs(ordersQuery);
  if (!querySnapshot.empty) {
    const orders = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const orderData = doc.data();
        const itemIds = orderData.orderInfo.orderItems;
        const items = await getMenuItems(itemIds);

        return {
          id: doc.id,
          orderInfo: orderData.orderInfo,
          items,
        };
      })
    );

    return orders;
  }

  return null;
};

export const createAddress = async (address: AddressType) => {
  try {
    addDoc(collection(db, "addresses"), address);
    console.log("New address Added");
    return "Success";
  } catch (error) {
    console.log(error);
  }
};

export const updateAddress = async (address: AddressType, id: string) => {
  try {
    setDoc(doc(db, "addresses", id), address);
    console.log("New address Added");
    return "Success";
  } catch (error) {
    console.log(error);
  }
};

export const getAddresses = async (
  userId: string
): Promise<AddressType[] | undefined> => {
  try {
    const addressesQuery = query(
      collection(db, "addresses"),
      where("userId", "==", userId)
    );
    const addressSnapShot = await getDocs(addressesQuery);

    const addresses = addressSnapShot.docs.map((address) => {
      const addressInfo = address.data();

      return {
        id: address.id,
        street: addressInfo.street,
        city: addressInfo.city,
        phone: addressInfo.phone,
        zipcode: addressInfo.zipcode,
        fullName: addressInfo.fullName,
      };
    });

    return addresses as AddressType[];
  } catch (error) {
    console.log(error);
  }
};

export const getAddressById = async (id: string) => {
  try {
    const adddressDoc = await getDoc(doc(db, "addresses", id));

    if (adddressDoc.exists()) {
      const addressData = adddressDoc.data() as AddressType;
      return addressData;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteAddress = async (id: string) => {
  try {
    await deleteDoc(doc(db, "addresses", id));
    console.log("Address document deleted successfully.");
  } catch (error) {
    console.log(error);
  }
};
