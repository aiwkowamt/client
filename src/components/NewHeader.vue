<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-warning shadow-lg">
    <div class="container">

      <router-link class="navbar-brand" to="/">DeliveryFood</router-link>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">

          <li class="nav-item" v-if="role === 'customer'">
            <router-link to="/search" class="nav-link">
              <i class="bi bi-search">Перейти к поиску</i>
            </router-link>
          </li>

          <li class="nav-item" v-if="role === 'customer'">
            <router-link class="nav-link" to="/settings">
              <i class="bi bi-geo-alt">{{ user.address || 'Местоположение не указано' }}</i>
            </router-link>
          </li>

          <li v-if="role === 'store'" class="nav-item">
            <router-link class="nav-link" to="/restaurant-create">
              <i class="bi bi-house-add">Добавить заведение</i>
            </router-link>
          </li>

          <li v-if="role === 'store'" class="nav-item">
            <router-link class="nav-link" to="/user-restaurants">
              <i class="bi bi-houses">Мои заведения</i>
            </router-link>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown"
               aria-expanded="false">
              <i class="bi bi-person"> {{ user.email }}</i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="userDropdown">
              <li v-if="!isLoggedIn"><router-link class="dropdown-item" to="/register">Регистрация</router-link></li>
              <li v-if="!isLoggedIn"><router-link class="dropdown-item" to="/login">Логин</router-link></li>
              <li v-if="isLoggedIn && role === 'customer'"><router-link class="dropdown-item" to="/orders/pending">Мои заказы</router-link></li>
              <li v-if="isLoggedIn && role === 'customer'"><router-link class="dropdown-item" to="/settings">Настройки</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a v-if="isLoggedIn" @click.prevent="preventLogoutUser" class="dropdown-item" href="#">Выйти</a></li>
            </ul>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import { useAuthStore } from "@/stores/Auth.js";
import { mapActions } from "pinia";

export default {
  mixins: [ValidatorMixin],
  data() {
    return {
      role: '',
      user: {
        address: '',
        email: '',
      },
    };
  },

  mounted() {
    this.getUserRole();
  },

  methods: {
    ...mapActions(useAuthStore, ["logoutUser"]),

    getUserRole() {
      AxiosInstance.get('/user')
          .then((response) => {
            this.role = response.data.user.role.name;
            this.user = response.data.user;
          });
    },

    preventLogoutUser() {
      this.logoutUser();
      this.role = null;
    },
  },

  computed: {
    isLoggedIn() {
      return useAuthStore().loggedIn;
    },
  },
};
</script>

<style scoped>
.bi-person {
  font-style: normal;
}

i{
  font-weight: 800;
}

.navbar-brand{
  font-family: 'Honk', system-ui;
  font-size: 60px;
  text-decoration: none;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
