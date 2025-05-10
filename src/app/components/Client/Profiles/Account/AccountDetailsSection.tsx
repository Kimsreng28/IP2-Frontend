import { motion } from "framer-motion";
import FormInput from "./FormInput";

const AccountDetailsSection = ({ formData, handleChange }) => {
  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Account Details
      </h2>

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

      <FormInput
        label="DISPLAY NAME"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="Display name"
        helpText="This will be how your name will be displayed in the account section and in reviews."
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

export default AccountDetailsSection;
