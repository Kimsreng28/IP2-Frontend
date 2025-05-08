"use client";

import AddressSection from "@/src/app/components/Client/Profiles/Address/AddressSection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const defaultAddress = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  country: "",
  phone: "",
};

const AddressPage = () => {
  const [billingAddress, setBillingAddress] = useState(defaultAddress);
  const [shippingAddress, setShippingAddress] = useState(defaultAddress);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.API_BASE_URL}/api/account/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch address");

        const data = await res.json();
        const address =
          data.addresses?.find((addr) => addr.is_default) ??
          data.addresses?.[0];

        if (address) {
          const formattedAddress = {
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            street: `${address.address_line1}${address.address_line2 ? ", " + address.address_line2 : ""}`,
            city: address.city ?? "",
            country: address.country ?? "",
            phone: data.phone_number ?? "(+1) 234 567 890",
          };

          setBillingAddress(formattedAddress);
          setShippingAddress(formattedAddress);
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };

    fetchAddress();
  }, []);

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Address
      </h2>
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
