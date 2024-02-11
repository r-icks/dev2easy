import apiClient from "@/utils/axios.config";

export const login = async (email, password) => {
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

export const register = async (email, password, age, sex, accountType) => {
  try {
    const response = await apiClient.post("/api/v1/auth/register", {
      email,
      password,
      age,
      sex,
      accountType,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
