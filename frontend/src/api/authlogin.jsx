import api from "./api";

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  }
  catch (error) {
    throw error;
  }
};
