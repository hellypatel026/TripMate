import { create } from "zustand";
import api from "../services/api";

const useTripStore = create((set) => ({

    trips: [],
    isLoading: false,

    // Get all trips of logged-in user
    getTrips: async () => {
        try {
            set({ isLoading: true });

            const response = await api.get("/trips");

            set({
                trips: response.data.trips,
                isLoading: false
            });

            return {
                success: true,
                data: response.data.trips
            };

        } catch (error) {

            set({ isLoading: false });

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch trips"
            };
        }
    },

    // Create a new trip
    createTrip: async (tripData) => {
        try {
            set({ isLoading: true });

            const response = await api.post(
                "/trips",
                tripData
            );

            set((state) => ({
                trips: [
                    ...state.trips,
                    response.data.trip
                ],
                isLoading: false
            }));

            return {
                success: true,
                data: response.data.trip
            };

        } catch (error) {

            set({ isLoading: false });

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to create trip"
            };
        }
    }

}));

export default useTripStore;