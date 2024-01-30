import {defineStore} from "pinia";
import AxiosInstance from "@/services/AxiosInstance";
import router from "@/router.js";
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: Cookies.get("token"),
        loginError: null,
    }),

    getters: {
        loggedIn: (state) => state.token != null,
        getLoginError: (state) => state.loginError,
    },

    actions: {
        loginUser(data) {
            AxiosInstance.post("/auth/login", {...data})
                .then((response) => {
                    this.token = response.data.token;
                    Cookies.set("token", this.token);
                    router.push("/");
                })
                .catch((err) => {
                    this.loginError = err.response.data.message;
                });
        },

        registerUser(data) {
            AxiosInstance.post('/auth/register', {...data})
                .then((response) => {
                    this.token = response.data.token;
                    Cookies.set("token", this.token);
                    router.push('/');
                })
        },

        logoutUser() {
            AxiosInstance.post('/auth/logout')
                .then(() => {
                    this.token = null;
                    Cookies.remove("token");
                    router.push('/login');
                })
        },

        async getUserRole() {
            try {
                const res = await AxiosInstance.get('/auth/user-role');
                return res.data.role;
            } catch (err) {
                console.error("Error while fetching user role:", err);
            }
        },
    },
})