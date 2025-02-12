import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth1 as auth, db1 as db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { UserInfo } from "./types";

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
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string; message: string };
      console.log(firebaseError.code);

      // Handle specific Firebase authentication errors
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password" ||
        firebaseError.code === "auth/invalid-credential"
      ) {
        return "Invalid username or password";
      } else if (firebaseError.code === "auth/too-many-requests") {
        return "Too many failed attempts. Please try again later.";
      } else if (firebaseError.code === "auth/network-request-failed") {
        return "Network error. Please check your connection.";
      }

      return firebaseError.message; // Default Firebase error message
    }

    return "An unknown error occurred.";
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

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
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
