// api/auth.ts
import axios from "axios";
import { GoogleUser } from "../types/user";
import { useNavigate } from "react-router-dom";
import api from "./axios";

export const loginUser = async (token: string): Promise<void> => {
  try {
    await api.post(
      "/auth/google",
      { token },
      { withCredentials: true }
    );
    
    const res = await api.get("/auth/me");
    localStorage.setItem("userInfo", JSON.stringify(res.data));

  } catch (error: any) {
    console.error("Google login failed", error);
    throw new Error(error?.response?.data?.detail || "Google login failed");
  }
};


export const logoutUser = (navigate: ReturnType<typeof useNavigate>) => {
  localStorage.removeItem("userInfo");
  navigate("/"); // use wherever needed
};
