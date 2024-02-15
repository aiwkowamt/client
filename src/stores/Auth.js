import {defineStore} from "pinia";
import AxiosInstance from "@/services/AxiosInstance";
import router from "@/router.js";
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: Cookies.get("token"),
        loginError: '',
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
                    location.reload();
                })
                .catch((err)=>{
                    this.loginError = err.response.data.message;
                })
        },

        registerUser(data) {
            AxiosInstance.post('/auth/register', {...data})
                .then((response) => {
                    this.token = response.data.token;
                    Cookies.set("token", this.token);
                    router.push('/');
                    location.reload();
                })
        },

        logoutUser() {
            AxiosInstance.post('/auth/logout')
                .then(() => {
                    this.token = null;
                    Cookies.remove("token");
                    localStorage.removeItem('cart');
                    router.push('/login');
                    location.reload();
                })
        },

        loginGithubCallback(code) {
            AxiosInstance.get(`authorize/github/callback?code=${code}`)
                .then((response) => {
                    this.token = response.data.token;
                    Cookies.set("token", this.token);
                    router.push('/');
                    // location.reload();
                })

        },
    },
})