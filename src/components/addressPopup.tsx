import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  const [initialValues, setInitialValues] = useState<AddressType>({
    fullName: "",
    street: "",
    city: "",
    phone: "",
    zipcode: "",
  });

  useEffect(() => {
    const fetchAddressById = async () => {
      if (addressId) {
        const fetchedAddress = await getAddressById(addressId);
        fetchedAddress && setInitialValues(fetchedAddress);
      }
    };

    if (type === "Edit") {
      fetchAddressById();
    } else {
      setInitialValues({
        fullName: "",
        street: "",
        city: "",
        phone: "",
        zipcode: "",
      });
    }
  }, [addressId, type]);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    zipcode: Yup.string()
      .matches(/^[a-zA-Z0-9]{6}$/, "Zipcode must be a 6-digit number")
      .required("Zipcode is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be a 10-digit number")
      .required("Phone is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      handleCreateAddress(values);
    },
  });

  return (
    <div className={"bg-white rounded shadow-lg p-6 max-w-sm w-full"}>
      <div className="text-right">
        <span
          className="font-bold cursor-pointer text-xl"
          onClick={handlePopup}
        >
          ✖
        </span>
      </div>
      <p className="text-[22px] text-center mb-3 font-semibold text-orange-500">
        {type} Address
      </p>
      <form onSubmit={formik.handleSubmit}>
        {["fullName", "street", "city", "zipcode", "phone"].map((field) => (
          <div key={field} className="relative mb-4">
            <input
              type="text"
              name={field}
              placeholder=" "
              className={`border border-gray-300 text-gray-900 rounded block w-full p-2 focus:outline-none text-sm ${
                formik.touched[field as keyof AddressType] &&
                formik.errors[field as keyof AddressType]
                  ? "border-red-500"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field as keyof AddressType]}
            />
            <label
              className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
                formik.values[field as keyof AddressType]
                  ? "bottom-[1.8rem] left-2 scale-75 z-40 text-gray-900"
                  : "top-2.5 scale-90"
              } origin-[0] transform pointer-events-none`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {formik.touched[field as keyof AddressType] &&
              formik.errors[field as keyof AddressType] && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors[field as keyof AddressType]}
                </p>
              )}
          </div>
        ))}

        <button
          className="bg-gray-700 text-[1rem] hover:bg-gray-950 capitalize font-semibold w-full py-2 rounded text-white"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddressPopup;
