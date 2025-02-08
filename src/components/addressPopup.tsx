import React, { useEffect, useState } from "react";
import { AddressType } from "../util/types";
import { getAddressById } from "../util/user";

type AddressPopupType = {
  type: string;
  addressId: string | null;
  handlePopup: () => void;
  handleCreateAddress: (address: AddressType) => void;
};
const AddressPopup: React.FC<AddressPopupType> = ({
  handlePopup,
  handleCreateAddress,
  type,
  addressId,
}) => {
  const [address, setAddress] = useState<AddressType | null>(null);

  const handleFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddress((prev) => {
      if (prev) {
        return { ...prev, [name]: value };
      }

      return {
        street: "",
        city: "",
        phone: "",
        zipcode: "",
        fullName: "",
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const fetchAddressById = async () => {
      if (addressId) {
        const address = await getAddressById(addressId);
        address && setAddress(address);
      }
    };
    if (type === "Edit") {
      fetchAddressById();
    } else {
      setAddress(null);
    }
  }, [addressId, type]);

  return (
    <div className={"bg-white rounded shadow-lg p-6 max-w-sm w-full"}>
      <div className="text-right ">
        <span
          className="font-bold cursor-pointer text-xl"
          onClick={handlePopup}
        >
          X
        </span>
      </div>
      <p className="text-[22px] text-center mb-3 font-semibold text-orange-500">
        {type} Address
      </p>
      <form>
        <div className="relative mb-4">
          <input
            type="text"
            name="fullName"
            placeholder=" "
            className=" border border-gray-200 text-gray-900 rounded block w-full p-2 focus:outline-none text-sm focus:border-gray-300  focus:ring-0"
            onChange={handleFields}
            value={address?.fullName}
          />

          <label
            className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
              address?.fullName
                ? "bottom-[1.8rem] left-2 scale-75 z-40  text-gray-900"
                : "top-2.5 scale-90"
            } origin-[0] transform pointer-events-none`}
          >
            Full Name
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            name="street"
            placeholder=" "
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-0 focus:border-gray-500 block w-full p-2 focus:outline-none text-sm"
            onChange={handleFields}
            value={address?.street}
          />
          <label
            className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
              address?.street
                ? "bottom-[1.8rem] left-2 scale-75 z-40  text-gray-800"
                : "top-2.5 scale-90"
            } origin-[0] transform pointer-events-none`}
          >
            Street
          </label>
        </div>

        <div className="relative my-4">
          <input
            type="text"
            name="city"
            placeholder=" "
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-0 focus:border-gray-500 block w-full p-2 focus:outline-none text-sm"
            onChange={handleFields}
            value={address?.city}
          />
          <label
            className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
              address?.city
                ? "bottom-[1.8rem] left-2 scale-75 z-40  text-gray-800"
                : "top-2.5 scale-90"
            } origin-[0] transform pointer-events-none`}
          >
            City
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            name="zipcode"
            placeholder=" "
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-0 focus:border-gray-100 block w-full p-2 focus:outline-none text-sm"
            onChange={handleFields}
            value={address?.zipcode}
          />
          <label
            className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
              address?.zipcode
                ? "bottom-[1.8rem] left-2 scale-75 z-40  text-gray-800"
                : "top-2.5 scale-90"
            } origin-[0] transform pointer-events-none`}
          >
            Zipcode
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            name="phone"
            placeholder=" "
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-0 focus:border-gray-500 block w-full p-2 focus:outline-none text-sm"
            onChange={handleFields}
            value={address?.phone}
          />
          <label
            className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
              address?.phone
                ? "bottom-[1.8rem] left-2 scale-75 z-40  text-gray-800"
                : "top-2.5 scale-90"
            } origin-[0] transform pointer-events-none`}
          >
            Phone
          </label>
        </div>

        <button
          className="bg-gray-700 text-[1rem] hover:bg-gray-950 capitalize font-semibold w-full py-2 rounded text-white"
          onClick={(e) => {
            e.preventDefault();
            address != null && handleCreateAddress(address);
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddressPopup;
