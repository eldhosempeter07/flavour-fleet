import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db1 as db, db1 } from "./firebase";
import { FoodItem, Restaurant } from "./types";

export const getRestaurants = async () => {
  const querysnapshot = await getDocs(collection(db1, "restaurants"));
  const restaurantItems: Restaurant[] = [];

  querysnapshot.forEach((doc) => {
    const data = doc.data();
    restaurantItems.push({
      id: doc.id,
      email: data.email || "",
      image: data.image || "",
      location: data.location || "",
      name: data.name || "",
      phone: data.phone || "",
      type: data.type || "",
    });
  });
  return restaurantItems;
};

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
    if (restaurantDoc.exists()) {
      const restaurantData = restaurantDoc.data() as Restaurant;
      if (restaurantData?.menu) {
        const menuItems = await getMenuItems(restaurantData.menu);
        return {
          ...restaurantData,
          menuItems: menuItems,
        };
      }
    } else {
      console.log("Restaurant not found");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getRestaurantsByCategory = async (
  category: string
): Promise<Restaurant[] | null> => {
  try {
    // Query all foodItems for the given category
    const q = query(
      collection(db, "foodItems"),
      where("category", "==", category)
    );

    const querySnapshot = await getDocs(q);
    const restaurantIds = new Set<string>();

    querySnapshot.forEach((foodItemDoc) => {
      if (foodItemDoc.exists()) {
        const foodItemData = foodItemDoc.data() as FoodItem;
        if (foodItemData.restaurantId) {
          restaurantIds.add(foodItemData.restaurantId);
        }
      }
    });

    // Fetch restaurants for the unique restaurantIds
    const restaurants: Restaurant[] = [];
    for (const restaurantId of restaurantIds) {
      const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
      if (restaurantDoc.exists()) {
        const restaurantData = restaurantDoc.data() as Restaurant;
        restaurants.push({ ...restaurantData, id: restaurantDoc.id });
      }
    }

    return restaurants.length > 0 ? restaurants : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getMenuItems = async (menuIds: string[]): Promise<FoodItem[]> => {
  const menuItems: FoodItem[] = [];

  for (const id of menuIds) {
    const q = query(collection(db, "foodItems"), where("id", "==", id));

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
