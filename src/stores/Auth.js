import {defineStore} from "pinia";
import AxiosInstance from "@/services/AxiosInstance";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // user: {},
        // token: localStorage.getItem("token"),
    }),

    actions: {
        registerUser(data) {
            AxiosInstance.post('/auth/register', {
                ...data
            }).then((response) => {
                console.log(response);
            }).catch(() => {
                console.log('Error');
            })
        },
    },
})