import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db1 as db } from "./firebase";
import {
  AddressType,
  CardType,
  CartInfo,
  CartItem,
  Categories,
  FoodItem,
  Order,
  OrderItems,
  Restaurant,
  userOrders,
} from "./types";

export const getCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "category"));
  const categories: Categories[] = [];
  querySnapshot.docs.map((doc) =>
    categories.push({ id: doc.id, name: doc.data().name })
  );

  return categories;
};

export const addToCart = async (
  id: string,
  count: number,
  resId: string,
  userId: string
) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      let updatedItems = cartData.items || [];

      const existingItemIndex = updatedItems.findIndex(
        (item: any) => item.itemId === id
      );

      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex].count += count;
      } else {
        updatedItems.push({ itemId: id, count });
      }

      await updateDoc(cartRef, { items: updatedItems });
    } else {
      await setDoc(cartRef, {
        items: [{ itemId: id, count }],
        restarantId: resId,
        userId,
      });

      return cartRef.id;
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

export const deleteFromCart = async (id: string, userId: string) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      let updatedItems = (cartData.items || []).filter(
        (item: any) => item.itemId !== id
      );

      // If the cart is empty after removal, delete the cart document
      if (updatedItems.length === 0) {
        await deleteDoc(cartRef);
      } else {
        await updateDoc(cartRef, { items: updatedItems });
      }
    }
  } catch (error) {
    console.error("Error deleting item from cart:", error);
  }
};

// Empty the entire cart
export const emptyCart = async (userId: string) => {
  try {
    const cartRef = doc(db, "carts", userId);
    await deleteDoc(cartRef);
  } catch (error) {
    console.error("Error emptying cart:", error);
  }
};

export const getCartItems = async (userId: string) => {
  try {
    if (userId) {
      const uid = userId;

      // Fetch the user's cart document
      const cartQuery = query(
        collection(db, "carts"),
        where("userId", "==", uid)
      );
      const cartSnapshot = await getDocs(cartQuery);

      if (!cartSnapshot.empty) {
        const cartinfo = cartSnapshot.docs[0].data() as CartInfo;

        // Initialize an array to store the full cart details
        const cartData = {
          cartinfo,
          items: [] as (FoodItem & { count: number })[],
          resturant: null as Restaurant | null,
          totalAmount: 0,
          count: 0,
        };
        const totalCount = cartinfo.items.reduce(
          (accumulator: number, item: CartItem) => {
            return accumulator + item.count;
          },
          0
        );

        cartData.count = totalCount;

        // Fetch restaurant info from the cart
        const restaurantDoc = await getDoc(
          doc(db, "restaurants", cartinfo.restarantId)
        );
        if (restaurantDoc.exists()) {
          cartData.resturant = restaurantDoc.data() as Restaurant;
        }

        const itemPromises = cartinfo.items.map(async (item) => {
          const q = query(
            collection(db, "foodItems"),
            where("id", "==", item.itemId)
          );
          const querySnapshot = await getDocs(q);

          let itemData: (FoodItem & { count: number }) | undefined;

          querySnapshot.forEach((foodItemDoc) => {
            if (foodItemDoc.exists()) {
              const foodItemData = foodItemDoc.data() as FoodItem;
              const totalItemPrice = foodItemData.price * item.count;
              cartData.totalAmount += totalItemPrice;

              itemData = {
                ...foodItemData,
                count: item.count,
                id: foodItemData.id,
              };
            }
          });

          return itemData; // return itemData instead of undefined
        });

        const items = await Promise.all(itemPromises);

        cartData.items = items.filter(
          (item): item is FoodItem & { count: number } => item !== undefined
        );

        return cartData;
      }
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
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
      querySnapshot.docs.map(async (orderDoc) => {
        const orderData = orderDoc.data();
        const itemIds = orderData.orderInfo.orderItems;

        // Fetch the restaurantId from the order data
        const restaurantId = orderData.orderInfo.restaurantId;

        // Get the restaurant details using the restaurantId
        const restaurantRef = doc(db, "restaurants", restaurantId);
        const restaurantSnapshot = await getDoc(restaurantRef);
        const restaurantData = restaurantSnapshot.data() as Restaurant;

        // Calculate total item count
        const totalCount = orderData.orderInfo.orderItems.reduce(
          (accumulator: number, item: { id: String; count: number }) => {
            return accumulator + item.count;
          },
          0
        );

        // Get menu items using itemIds
        const items = await getMenuItems(itemIds);

        // Return the order with restaurant data
        return {
          id: orderDoc.id,
          orderInfo: orderData.orderInfo,
          totalCount: totalCount,
          items,
          restaurant: restaurantData,
        };
      })
    );

    return orders;
  }

  return null;
};

export const getOrderById = async (
  orderId: string
): Promise<userOrders | null> => {
  // Get the order document by orderId
  const orderDocRef = doc(db, "orders", orderId);
  const orderDocSnapshot = await getDoc(orderDocRef);

  if (orderDocSnapshot.exists()) {
    const orderData = orderDocSnapshot.data();
    const itemIds = orderData?.orderInfo.orderItems;

    const items = await getMenuItems(itemIds);

    return {
      id: orderDocSnapshot.id,
      orderInfo: orderData?.orderInfo,
      items,
    };
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

export const getMenuItems = async (
  menuIds: OrderItems[]
): Promise<FoodItem[]> => {
  const menuItems: FoodItem[] = [];
  for (const menu of menuIds) {
    const q = query(
      collection(db, "foodItems"),
      where("id", "==", menu.itemId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((foodItemDoc) => {
      if (foodItemDoc.exists()) {
        const foodItemData = foodItemDoc.data() as FoodItem;
        menuItems.push({ ...foodItemData, id: foodItemData.id });
      }
    });
  }

  return menuItems;
};

export const createCard = async (card: CardType) => {
  try {
    await addDoc(collection(db, "cards"), card);
    console.log("New card added");
    return "Success";
  } catch (error) {
    console.log(error);
  }
};

export const updateCard = async (card: CardType, id: string) => {
  try {
    await setDoc(doc(db, "cards", id), card);
    console.log("Card updated");
    return "Success";
  } catch (error) {
    console.log(error);
  }
};

export const getCards = async (
  userId: string
): Promise<CardType[] | undefined> => {
  try {
    const cardsQuery = query(
      collection(db, "cards"),
      where("userId", "==", userId)
    );
    const cardSnapShot = await getDocs(cardsQuery);

    const cards = cardSnapShot.docs.map((card) => {
      const cardInfo = card.data();

      return {
        id: card.id,
        cardholderName: cardInfo.cardholderName,
        cardNumber: cardInfo.cardNumber,
        expiryDate: cardInfo.expiryDate,
        cvv: cardInfo.cvv,
        zipcode: cardInfo.zipcode,
      };
    });

    return cards as CardType[];
  } catch (error) {
    console.log(error);
  }
};

export const getCardById = async (id: string) => {
  try {
    const cardDoc = await getDoc(doc(db, "cards", id));

    if (cardDoc.exists()) {
      const cardData = cardDoc.data() as CardType;
      return cardData;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteCard = async (id: string) => {
  try {
    await deleteDoc(doc(db, "cards", id));
    console.log("Card document deleted successfully.");
  } catch (error) {
    console.log(error);
  }
};
