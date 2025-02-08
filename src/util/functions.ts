import { getDownloadURL, ref } from "firebase/storage";
import { storage1 } from "./firebase";
import { Timestamp } from "./types";

export type ImageProps = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
};

export const getImage = ({ imageUrl, setImageUrl, setLoading }: ImageProps) => {
  const imagePath = `gs://yumhub-d8edd.appspot.com/${imageUrl}`;

  if (imagePath) {
    const storageRef = ref(storage1, imagePath); // Get a reference to the image in Firebase Storage

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
  } else {
    setLoading(false);
  }
};

export const handleDate = (timestamp: Timestamp) => {
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

  const date = new Date(milliseconds);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options).replace(",", "");

  return formattedDate;
};
