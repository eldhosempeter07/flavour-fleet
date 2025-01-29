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
    }
  }, [addressId, type]);

  return (
    <div className={"bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"}>
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
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="mb-2"
          onChange={handleFields}
          value={address?.fullName}
        />
        <input
          type="text"
          name="street"
          placeholder="street"
          className="block  mb-2"
          onChange={handleFields}
          value={address?.street}
        />
        <input
          type="text"
          name="city"
          placeholder="city"
          className="block  mb-2"
          onChange={handleFields}
          value={address?.city}
        />
        <input
          type="text"
          name="zipcode"
          placeholder="zipcode"
          className="block mb-2"
          onChange={handleFields}
          value={address?.zipcode}
        />

        <input
          type="text"
          name="phone"
          placeholder="phone"
          className="block mb-2"
          onChange={handleFields}
          value={address?.phone}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white  rounded px-4 py-2 mt-2 "
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
