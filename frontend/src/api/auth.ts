// api/auth.ts
import axios from "axios";
import { GoogleUser } from "../types/user";
import { useNavigate } from "react-router-dom";

export const loginUser = async (token: string): Promise<GoogleUser> => {
  try {
    const res = await axios.post<GoogleUser>(
      "http://127.0.0.1:8000/auth/google",
      { token }
    );

    const userData = res.data;
    localStorage.setItem("userInfo", JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    console.error("Google login failed", error);
    throw new Error(error?.response?.data?.detail || "Google login failed");
  }
};

export const logoutUser = (navigate: ReturnType<typeof useNavigate>) => {
  localStorage.removeItem("userInfo");
  navigate("/login"); // use wherever needed
};
