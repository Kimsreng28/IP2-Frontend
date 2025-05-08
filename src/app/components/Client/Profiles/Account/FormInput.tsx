import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  helpText,
  disabled = false,
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-4 font-poppins"
    >
      <label className="mb-1 block text-[12px] font-medium text-gray-500 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-gray-500 focus:ring-gray-500
          ${disabled ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" : "bg-white dark:bg-gray-900 dark:text-white"}
          dark:border-gray-700 dark:focus:border-gray-400 dark:focus:ring-gray-400`}
      />
      {helpText && (
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mt-1 font-poppins text-xs italic text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormInput;
