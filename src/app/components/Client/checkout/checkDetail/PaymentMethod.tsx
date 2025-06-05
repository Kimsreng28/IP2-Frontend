import { motion } from "framer-motion";
import { useState } from "react";
import FormInput from "../../Profiles/Account/FormInput";

const paymentMethodOptions = [
  { id: "MasterCard", name: "Master Card", image: "/images/logo/master.png" },
  { id: "VisaCard", name: "Visa Card", image: "/images/logo/visa.png" },
  { id: "ABA", name: "ABA", image: "/images/logo/aba.png" },
  { id: "ACLENDA", name: "ACLENDA", image: "/images/logo/ac.png" },
];

const PaymentMethods = ({ formData, handleChange }) => {
  const [selectedMethod, setSelectedMethod] = useState("MasterCard");

  const handlePaymentSelect = (id: string) => {
    const event = {
      target: {
        name: "paymentMethod",
        value: id,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  return (
    <motion.div
      className="space-y-6 rounded-lg border border-gray-200 p-4 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Payment Methods
      </h2>

      <div className="mb-6 space-y-3">
        {paymentMethodOptions.map((option) => (
          <div
            key={option.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
              formData.paymentMethod === option.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300"
            }`}
            onClick={() => handlePaymentSelect(option.id)}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id={option.id}
                name="paymentMethod"
                checked={formData.paymentMethod === option.id}
                onChange={() => handlePaymentSelect(option.id)}
                className="h-4 w-4 accent-blue-600"
              />
              <label
                htmlFor={option.id}
                className="text-sm text-gray-800 dark:text-gray-200"
              >
                {option.name}
              </label>
            </div>
            <img
              src={option.image}
              alt={option.name}
              className="h-8 w-20 object-contain"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t pb-1 pt-1"></div>

      <FormInput
        label="CARD NUMBER"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        placeholder="Card Number"
        helpText={undefined}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label="EXPIRATION DATE"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          placeholder="Expiration Date"
          helpText={undefined}
        />

        <FormInput
          label="CVC"
          name="cvc"
          value={formData.cvc}
          onChange={handleChange}
          placeholder="CVC"
          helpText={undefined}
        />
      </div>
    </motion.div>
  );
};

export default PaymentMethods;
