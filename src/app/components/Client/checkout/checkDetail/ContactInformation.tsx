import { motion } from "framer-motion";
import FormInput from "../../Profiles/Account/FormInput";

const ContactInformation = ({ formData, handleChange }) => {
  return (
    <motion.div
      className="space-y-6 rounded-lg border border-gray-200 p-4 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label="FIRST NAME"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First name"
          helpText={undefined}
        />

        <FormInput
          label="LAST NAME"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last name"
          helpText={undefined}
        />
      </div>

      <FormInput
        label="PHONE NUMBER"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone number"
        helpText={undefined}
      />

      <FormInput
        label="EMAIL"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        helpText={undefined}
      />
    </motion.div>
  );
};

export default ContactInformation;
