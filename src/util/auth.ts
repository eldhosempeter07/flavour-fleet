import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { UserInfo } from "./interface";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name,
      phone: null,
    });

    console.log("User registered and data saved to Firestore");
  } catch (error) {
    console.log("Error", error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log("Error", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getUserInfo = async (email: string) => {
  try {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const querySnapshot = await getDocs(userQuery);
    console.log(querySnapshot.empty);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      console.log(userDoc.data());
      return { id: userDoc.id, ...userDoc.data() };
    }
  } catch (error) {
    console.log(Error);
  }
};

export const updatetUserInfo = async (user: UserInfo) => {
  try {
    const { email, id, name, phone } = user;
    await setDoc(doc(db, "users", id), {
      email,
      name,
      phone,
    });

    return;
  } catch (error) {
    console.log(Error);
  }
};
