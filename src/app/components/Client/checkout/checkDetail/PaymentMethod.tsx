import { motion } from "framer-motion";
import FormInput from "../../Profiles/Account/FormInput";

const paymentMethodOptions = [
  { id: "MasterCard", name: "Master Card", image: "/images/logo/master.png" },
  { id: "VisaCard", name: "Visa Card", image: "/images/logo/visa.png" },
  { id: "ABA", name: "ABA", image: "/images/logo/aba.png" },
  { id: "ACLEDA", name: "ACLEDA", image: "/images/logo/ac.png" },
];

const PaymentMethods = ({
  formData,
  handleChange,
  onAbaOptionChange,
  onAcledaOptionChange,
}) => {
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

      {["MasterCard", "VisaCard"].includes(formData.paymentMethod) && (
        <>
          <div className="space-y-2 border-t pb-1 pt-1"></div>
          <FormInput
            label="CARD NUMBER"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            helpText={undefined}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="EXPIRATION DATE"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              placeholder="MM/YY"
              helpText={undefined}
            />
            <FormInput
              label="CVV"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              helpText={undefined}
            />
          </div>
        </>
      )}

      {formData.paymentMethod === "ABA" && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => onAbaOptionChange("payway")}
              className={`flex-1 rounded-lg py-2 ${
                formData.abaOption === "payway"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              ABA Payway
            </button>
            <button
              onClick={() => onAbaOptionChange("khqr")}
              className={`flex-1 rounded-lg py-2 ${
                formData.abaOption === "khqr"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              KHQR
            </button>
          </div>

          {formData.abaOption === "payway" ? (
            <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You will be redirected to ABA Payway to complete your payment
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <p className="mb-2 text-sm font-medium">Scan KHQR Code</p>
              <div className="flex justify-center">
                <div className="flex h-48 w-48 items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-xs text-gray-500">KHQR Code</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Open ABA Mobile app and scan this QR code to pay
              </p>
            </div>
          )}
        </div>
      )}

      {formData.paymentMethod === "ACLEDA" && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => onAcledaOptionChange("payway")}
              className={`flex-1 rounded-lg py-2 ${
                formData.abaOption === "payway"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              ACLENDA Payway
            </button>
            <button
              onClick={() => onAcledaOptionChange("khqr")}
              className={`flex-1 rounded-lg py-2 ${
                formData.abaOption === "khqr"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              KHQR
            </button>
          </div>

          {formData.abaOption === "payway" ? (
            <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You will be redirected to ACLENDA Payway to complete your
                payment
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <p className="mb-2 text-sm font-medium">Scan KHQR Code</p>
              <div className="flex justify-center">
                <div className="flex h-48 w-48 items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-xs text-gray-500">KHQR Code</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Open ACLENDA Mobile app and scan this QR code to pay
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PaymentMethods;
