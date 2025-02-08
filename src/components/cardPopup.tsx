import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CardType } from "../util/types";
import { getCardById } from "../util/user";

type CardPopupType = {
  type: string;
  cardId: string | null;
  handlePopup: () => void;
  handleCreateCard: (card: CardType) => void;
};

const CardPopup: React.FC<CardPopupType> = ({
  handlePopup,
  handleCreateCard,
  type,
  cardId,
}) => {
  const [initialValues, setInitialValues] = useState<CardType>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    zipcode: "",
  });

  useEffect(() => {
    const fetchCardById = async () => {
      if (cardId) {
        const fetchedCard = await getCardById(cardId);
        fetchedCard && setInitialValues(fetchedCard);
      }
    };

    if (type === "Edit") {
      fetchCardById();
    } else {
      setInitialValues({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        zipcode: "",
      });
    }
  }, [cardId, type]);

  const validationSchema = Yup.object({
    cardholderName: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Cardholder Name is required"),
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, "Card Number must be 16 digits")
      .required("Card Number is required"),
    expiryDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry Date must be MM/YY format")
      .required("Expiry Date is required"),
    zipcode: Yup.string()
      .matches(/^[a-zA-Z0-9]{6}$/, "Zipcode must be 6 digits")
      .required("Zipcode is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Updates form values dynamically
    validationSchema,
    onSubmit: (values) => {
      handleCreateCard(values);
    },
  });

  return (
    <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
      <div className="text-right">
        <span
          className="font-bold cursor-pointer text-xl"
          onClick={handlePopup}
        >
          ✖
        </span>
      </div>
      <p className="text-[22px] text-center mb-3 font-semibold text-orange-500">
        {type} Card
      </p>
      <form onSubmit={formik.handleSubmit}>
        {["cardholderName", "cardNumber", "expiryDate", "zipcode"].map(
          (field) => (
            <div key={field} className="relative mb-4">
              <input
                type="text"
                name={field}
                placeholder=" "
                className={`border border-gray-300 text-gray-900 rounded block w-full p-2 focus:outline-none text-sm ${
                  formik.touched[field as keyof CardType] &&
                  formik.errors[field as keyof CardType]
                    ? "border-red-500"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field as keyof CardType]}
              />
              <label
                className={`absolute text-sm text-gray-600 transition-all duration-300 ease-in-out left-3 ${
                  formik.values[field as keyof CardType]
                    ? "bottom-[1.8rem] left-2 scale-75 z-40 text-gray-900"
                    : "top-2.5 scale-90"
                } origin-[0] transform pointer-events-none`}
              >
                {field
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              {formik.touched[field as keyof CardType] &&
                formik.errors[field as keyof CardType] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors[field as keyof CardType]}
                  </p>
                )}
            </div>
          )
        )}

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

export default CardPopup;
