import React from "react";
import Next from "../assets/next.png";

interface KeywordDropdownProps {
  keywords: string[] | null;
  loading: boolean;
  search: string;
  onSelect: (keyword: string) => void;
}

const KeywordDropdown: React.FC<KeywordDropdownProps> = ({
  keywords,
  loading,
  search,
  onSelect,
}) => {
  const trimmedSearch = search.trim();

  if (loading) {
    return (
      <div className="absolute left-0 top-6 mt-4 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-2 bg-gray-100 rounded-full mb-2.5"
            style={{ maxWidth: `${360 - i * 10}px` }}
          ></div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (trimmedSearch.length === 0) {
    return null;
  }

  if (keywords && keywords.length > 0) {
    return (
      <div className="absolute left-0 top-6 mt-4 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="border-[0.1rem] cursor-pointer border-gray-100 py-2 flex justify-between"
            onClick={() => onSelect(keyword)}
          >
            <h4 className="ml-3">{keyword}</h4>
            <img src={Next} alt="next" className="mr-3 w-5 h-5" />
          </div>
        ))}
      </div>
    );
  }

  if (trimmedSearch.length > 1 && (!keywords || keywords.length === 0)) {
    return (
      <div className="absolute left-0 top-6 mt-4 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
        <h3 className="p-3 text-gray-500">No Items Found</h3>
      </div>
    );
  }

  return null;
};

export default KeywordDropdown;
