import {defineStore} from "pinia";
import AxiosInstance from "@/services/AxiosInstance";
import router from "@/router.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {},
        token: localStorage.getItem("token"),
    }),

    getters: {
        loggedIn: (state) => state.token !== null
    },

    actions: {
        loginUser(data) {
            return AxiosInstance.post("/auth/login", { ...data })
                .then((response) => {
                    this.token = response.data.token;
                    this.user = response.data.user;
                    console.log("token: ", this.token, "user: ", this.user);

                    localStorage.setItem("token", this.token);
                    router.push("/");
                })
                .catch((err) => {
                    const message = err.response.data;
                    console.log(message);
                    return message;
                });
        },

        registerUser(data) {
            AxiosInstance.post('/auth/register', {
                ...data
            }).then((response) => {
                this.token = response.data.token;
                this.user = response.data.user;
                console.log('token: ', this.token, 'user: ', this.user)

                localStorage.setItem('token', this.token);
                router.push('/');
            }).catch((err) => {
                console.log(err);
            })
        },

        logoutUser() {
            AxiosInstance.post('/auth/logout')
                .then(() => {
                    this.user = {};
                    this.token = null;
                    localStorage.removeItem('token');
                    router.push('/login');
                })
        },
    },
})