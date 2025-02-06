import React, { useEffect, useState } from "react";
import { Categories } from "../util/types";
import { getImage } from "../util/functions";

type CategoryProps = {
  category: Categories;
  setCategory: (category: string) => void;
};

const CategoryImage: React.FC<CategoryProps> = ({ category, setCategory }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImage({
      imageUrl: `category/${category.name}.png`,
      setImageUrl,
      setLoading,
    });
  }, [category]);

  return (
    <div>
      <div className="relative w-16 h-20 mx-5 flex justify-center items-center">
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : imageUrl ? (
          <div
            className="cursor-pointer"
            onClick={() => setCategory(category.name)}
          >
            <img
              className="w-full h-full object-contain rounded pointer-events-none"
              src={imageUrl}
              alt={category.name}
            />
            <h4 className="text-center text-sm font-semibold z-40">
              {category.name}
            </h4>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryImage;
