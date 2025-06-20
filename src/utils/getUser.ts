// utils/getUser.ts

export function getUserFromLocalStorage(): { id: number } {
  try {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      console.warn("User not found in localStorage. Using default ID 1.");
      return { id: 1 };
    }

    const user = JSON.parse(userRaw);

    if (!user?.id || typeof user.id !== "number") {
      console.warn("Invalid or missing user ID. Using default ID 1.");
      return { id: 1 };
    }

    return user;
  } catch (error) {
    console.warn("Error parsing user from localStorage. Using default ID 1.");
    return { id: 1 };
  }
}
