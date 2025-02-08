import React, { useEffect, useState } from "react";
import { storage1 } from "../util/firebase"; // Import Firebase config
import { ref, getDownloadURL } from "firebase/storage"; // Import required Firebase functions
import LoadingScreen from "./loadingScreen";

const ImageDisplay = () => {
  const [imageUrl, setImageUrl] = useState(""); // State to store the image URL
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    // Replace this with the path to your image in Firebase Storage
    const imagePath = "gs://yumhub-d8edd.appspot.com/AsianCWrap.jpg"; // Example path in Firebase Storage

    const storageRef = ref(storage1, imagePath); // Get a reference to the image

    // Get the download URL of the image
    getDownloadURL(storageRef)
      .then((url) => {
        setImageUrl(url); // Set the image URL in state
        setLoading(false); // Set loading to false once the image is fetched
      })
      .catch((error) => {
        console.error("Error fetching image URL: ", error);
        setLoading(false);
      });
  }, []);
  // if (!loading) {
  //   return (
  //     <>
  //       <LoadingScreen />
  //     </>
  //   );
  // }

  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Firebase Storage"
          style={{ maxWidth: "100%" }}
        />
      ) : (
        <p>Failed to load image</p>
      )}
    </div>
  );
};

export default ImageDisplay;
