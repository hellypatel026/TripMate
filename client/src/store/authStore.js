import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    register: async (userData) => {
        try {
            set({ isLoading: true });

            const response = await api.post(
                "/auth/register",
                userData
            );

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false
            });

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            set({ isLoading: false });

            return {
                success: false,
                error: error.response?.data?.message ||
                    "Registration failed"
            };
        }
    },


    login: async (credentials) => {
        try {
            set({ isLoading: true });

            const response = await api.post(
                "/auth/login",
                credentials
            );

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false
            });

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            set({ isLoading: false });

            return {
                success: false,
                error: error.response?.data?.message ||
                    "Login failed"
            };
        }
    },


    getMe: async () => {
        try {

            const response = await api.get(
                "/auth/me"
            );

            set({
                user: response.data.user,
                isAuthenticated: true
            });

            return response.data.user;

        } catch (error) {

            set({
                user: null,
                isAuthenticated: false
            });

            return null;
        }
    },


    logout: async () => {
        try {

            await api.post("/auth/logout");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        } finally {

            set({
                user: null,
                isAuthenticated: false
            });

        }
    }
}));

export default useAuthStore;