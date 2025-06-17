// lib/admin-api.ts
const ADMIN_API_BASE_URL = "http://localhost:3001/api/admin/dashboard";

export const adminApi = {
  test: async () => {
    try {
      const res = await fetch(`${ADMIN_API_BASE_URL}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  },
};