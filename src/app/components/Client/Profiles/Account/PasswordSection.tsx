import { motion } from "framer-motion";
import FormInput from "./FormInput";

const PasswordSection = ({ formData, handleChange }) => {
  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Password
      </h2>

      <FormInput
        label="OLD PASSWORD"
        name="oldPassword"
        value={formData.oldPassword}
        onChange={handleChange}
        placeholder="Old password"
        type="password"
        helpText={undefined}
      />
      <FormInput
        label="NEW PASSWORD"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="New password"
        type="password"
        helpText={undefined}
      />
      <FormInput
        label="REPEAT NEW PASSWORD"
        name="repeatPassword"
        value={formData.repeatPassword}
        onChange={handleChange}
        placeholder="Repeat new password"
        type="password"
        helpText={undefined}
      />
    </motion.div>
  );
};

export default PasswordSection;
