import React, { useEffect, useState } from "react";
import { Categories } from "../util/types";
import { getImage } from "../util/functions";
import { useCategory } from "../util/categoryContext";

type CategoryProps = {
  category: Categories;
};

const CategoryImage: React.FC<CategoryProps> = ({ category }) => {
  const { setSelectedCategory, selectedCategory } = useCategory();

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
      <div className="relative w-16 h-24 mx-5 flex justify-center items-center">
        <div
          className="cursor-pointer"
          onClick={() => {
            selectedCategory === category.name
              ? setSelectedCategory(null)
              : setSelectedCategory(category.name);
          }}
        >
          {loading ? (
            <div className="text-gray-500 w-16 h-16"></div>
          ) : imageUrl ? (
            <img
              className={`w-16 h-16 object-contain rounded pointer-events-none ${
                selectedCategory === category.name
                  ? "bg-orange-400 rounded-full"
                  : null
              } `}
              src={imageUrl}
              alt={category.name}
            />
          ) : null}
          <h4
            className={`${
              selectedCategory === category.name ? "text-orange-400" : null
            } text-center text-sm font-semibold z-40`}
          >
            {category.name}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CategoryImage;
