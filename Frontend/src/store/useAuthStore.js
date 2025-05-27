import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { use } from "react";
import { useNavigate } from "react-router-dom";




export const useAuthStore = create((set) => ({

  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,



  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      console.log("checkauth started");
      
      const res = await axiosInstance.get("/auth/check");
      console.log("checkauth response", res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    console.log("signup data", data);
    set({ isSigninUp: true });
    try {
      console.log("signup started");
      
      const res = await axiosInstance.post("/auth/register", data);
      console.log("signup response data", res.data);
     

      set({ authUser: res.data.user});
      console.log("authUser", useAuthStore.getState().authUser);  
      
      toast.success(res.data.message);

    } catch (error) {
      console.log("Error signing up", error);
      // console.log("Data",res.data.user);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    console.log("login data", data);
    
    set({ isLoggingIn: true });
    try {
      // console.log("login started");
      
      const res = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });
      console.log("login response data", res.data);

      set({ authUser: res.data.user });

      console.log("authUser", useAuthStore.getState().authUser);
      

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error.message);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
}));