"use client";

import AccountDetailsSection from "./AccountDetailsSection";
import PasswordSection from "./PasswordSection";

const AccountForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 rounded-lg bg-white shadow-sm dark:bg-gray-900"
    >
      <div className="space-y-8">
        <AccountDetailsSection
          formData={formData}
          handleChange={handleChange}
        />
        <PasswordSection formData={formData} handleChange={handleChange} />
      </div>

      <button
        type="submit"
        className="mt-8 rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-300 dark:focus:ring-gray-200 dark:focus:ring-offset-gray-800"
      >
        Save changes
      </button>
    </form>
  );
};

export default AccountForm;
