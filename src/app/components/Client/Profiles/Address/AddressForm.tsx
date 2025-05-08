"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

const AddressForm = ({
  address,
  onSave,
  onCancel,
  type,
}: {
  address: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  type: "billing" | "shipping";
}) => {
  const [formData, setFormData] = useState(address);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 font-[Poppins]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "FIRST NAME", name: "firstName" },
          { label: "LAST NAME", name: "lastName" },
          { label: "STREET ADDRESS", name: "street", colSpan: true },
          { label: "TOWN / CITY", name: "city" },
          { label: "COUNTRY", name: "country" },
          { label: "PHONE NUMBER", name: "phone", optional: true },
        ].map((field, index) => (
          <div key={index} className={field.colSpan ? "md:col-span-2" : ""}>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300">
              {field.label} {field.optional ? "" : "*"}
            </label>
            <input
              type={field.name === "phone" ? "tel" : "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={!field.optional}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-300"
        >
          Save
        </button>
      </div>
    </motion.form>
  );
};

export default AddressForm;
