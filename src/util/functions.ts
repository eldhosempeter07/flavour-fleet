import { getDownloadURL, ref } from "firebase/storage";
import { storage1 } from "./firebase";

export type ImageProps = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
};

export const getImage = ({ imageUrl, setImageUrl, setLoading }: ImageProps) => {
  console.log(imageUrl);

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
