import {defineStore} from "pinia";
import AxiosInstance from "@/services/AxiosInstance";
import router from "@/router.js";
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {},
        token: Cookies.get("token"),
        loginError: null,
    }),

    getters: {
        loggedIn: (state) => state.token != null,
        getUserRoleId: (state) => state.user.role_id,
        getLoginError: (state) => state.loginError,
    },

    actions: {
        loginUser(data) {
            AxiosInstance.post("/auth/login", {...data})
                .then((response) => {
                    this.token = response.data.token;
                    this.user = response.data.user;
                    // console.log("token: ", this.token, "user: ", this.user);
                    Cookies.set("token", this.token);
                    router.push("/");
                })
                // .catch((err) => {
                //     this.loginError = err.response.data.message;
                // });
        },

        registerUser(data) {
            AxiosInstance.post('/auth/register', {...data})
                .then((response) => {
                    this.token = response.data.token;
                    this.user = response.data.user;
                    // console.log('token: ', this.token, 'user: ', this.user)
                    Cookies.set("token", this.token);
                    router.push('/');
                })
        },

        logoutUser() {
            AxiosInstance.post('/auth/logout')
                .then(() => {
                    this.user = {};
                    this.token = null;
                    Cookies.remove("token");
                    router.push('/login');
                })
        },

        getUserRole() {
            AxiosInstance.get('/auth/user-role')
                .then((response) => {
                    this.user.role = response.data.role;
                })
        },
    },
})