import { motion } from "framer-motion";
import FormInput from "../../Profiles/Account/FormInput";

const ShippingAddress = ({ formData, handleChange }) => {
  return (
    <motion.div
      className="space-y-6 rounded-lg border border-gray-200 p-4 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Shipping Address
      </h2>

      <FormInput
        label="STREET ADDRESS*"
        name="streetAddress"
        value={formData.streetAddress}
        onChange={handleChange}
        placeholder="Street Address"
        helpText={undefined}
      />

      <FormInput
        label="COUNTRY*"
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="Country"
        helpText={undefined}
      />

      <FormInput
        label="TOWN/CITY*"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="Town/City"
        helpText={undefined}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label="STATE"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          helpText={undefined}
        />

        <FormInput
          label="ZIP CODE"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="Zip Code"
          helpText={undefined}
        />
      </div>

      {/* Checkbox */}
      <div className="mt-4 flex items-center space-x-3">
        <input
          id="saveInfo"
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-blue-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-400"
        />
        <label
          htmlFor="saveInfo"
          className="cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-300"
        >
          Use a different billing address (optional)
        </label>
      </div>
    </motion.div>
  );
};

export default ShippingAddress;
