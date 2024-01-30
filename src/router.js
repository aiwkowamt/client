import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from "@/stores/Auth.js";

const routes = [
    {
        path: "/",
        name: "home",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/HomePage.vue"),
    },

    {
        path: "/declaration-create",
        name: "declaration-create",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/customer/DeclarationCreatePage.vue"),
    },

    {
        path: "/search",
        name: "search",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/customer/SearchPage.vue"),
    },

    {
        path: "/restaurant-create",
        name: "restaurant-create",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/store/RestaurantCreatePage.vue"),
    },

    {
        path: "/user-restaurants",
        name: "user-restaurants",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/store/UserRestaurantsPage.vue")
    },

    {
        path: "/restaurant-edit/:id",
        name: "restaurant-edit",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/store/RestaurantEditPage.vue"),
        props: true,
    },

    {
        path: "/dish-create/:restaurant_id",
        name: "dish-create",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/store/DishCreatePage.vue"),
        props: true,
    },

    {
        path: "/restaurant-dishes/:restaurant_id",
        name: "restaurant-dishes",
        meta: {
            requiresAuth: true
        },
        component: () => import("@/pages/private/customer/RestaurantDishesPage.vue"),
        props: true,
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