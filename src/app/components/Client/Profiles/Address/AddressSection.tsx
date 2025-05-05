"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AddressForm from "./AddressForm";

const AddressSection = ({
  address,
  type,
  onSave,
}: {
  address: any;
  type: "billing" | "shipping";
  onSave: (data: any) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (data: any) => {
    onSave(data);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-gray-200 p-6 font-poppins dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {type === "billing" ? "Billing Address" : "Shipping Address"}
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Edit
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <AddressForm
              address={address}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              type={type}
            />
          </motion.div>
        ) : (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2 text-gray-800 dark:text-gray-200"
          >
            <p>
              {address.firstName} {address.lastName}
            </p>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.country}
            </p>
            {address.phone && <p>{address.phone}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddressSection;
