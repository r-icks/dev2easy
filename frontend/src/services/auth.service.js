import apiClient from "@/utils/axios.config";

export const login = async ({ email, password }) => {
  try {
    const response = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (values) => {
  try {
    const response = await apiClient.post("/api/v1/auth/register", values);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/api/v1/auth/getCurrentUser");
    return response.data;
  } catch (error) {
    throw error;
  }
};
