import { doc, getDoc } from "firebase/firestore";
import { db1 as db } from "./firebase";
import { FoodItem, Restaurant } from "./types";

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

const getMenuItems = async (menuIds: string[]): Promise<FoodItem[]> => {
  const menuItems: FoodItem[] = [];
  for (const id of menuIds) {
    const foodItemDoc = await getDoc(doc(db, "foodItems", id));

    if (foodItemDoc.exists()) {
      const foodItemData = foodItemDoc.data() as FoodItem;
      menuItems.push({ ...foodItemData, id });
    }
  }

  return menuItems;
};
