"use client";

import AddressSection from "@/src/app/components/Client/Profiles/Address/AddressSection";
import { motion } from "framer-motion";
import { useState } from "react";

const AddressPage = () => {
  const [billingAddress, setBillingAddress] = useState({
    firstName: "Sofia",
    lastName: "Havertz",
    street: "345 Long Island",
    city: "NewYork",
    country: "United States",
    phone: "(+1) 234 567 890",
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "Sofia",
    lastName: "Havertz",
    street: "345 Long Island",
    city: "NewYork",
    country: "United States",
    phone: "(+1) 234 567 890",
  });

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AddressSection
        address={billingAddress}
        type="billing"
        onSave={setBillingAddress}
      />
      <AddressSection
        address={shippingAddress}
        type="shipping"
        onSave={setShippingAddress}
      />
    </motion.div>
  );
};

export default AddressPage;
