import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from "@/stores/Auth.js";

const routes = [
    {
        path: "/",
        name: "home",
        meta: {requiresAuth: true},
        component: () => import("@/pages/private/HomePage.vue"),

    },
    {
        path: "/PartnerHomePage",
        name: "PartnerHomePage",
        meta: {requiresAuth: true},
        component: () => import("@/pages/private/PartnerHomePage.vue"),

    },
    {
        path: "/SearchPage",
        name: "SearchPage",
        meta: {requiresAuth: true},
        component: () => import("@/pages/private/SearchPage.vue"),

    },

    {
        path: "/login",
        name: "login",
        component: () => import("@/pages/public/LoginPage.vue"),
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/pages/public/RegisterPage.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !authStore.loggedIn) {
        router.push('/login');
    } else if ((to.name === 'register' || to.name === 'login') && authStore.loggedIn) {
        router.push('/');
    } else {
        next();
    }
});

export default router;