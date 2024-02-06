<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-success" aria-label="Fourth navbar example">
    <div class="container">
      <router-link class="navbar-brand" to="/">DeliveryFood</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04"
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li v-if="role === 'customer'" class="nav-item">
            <router-link class="nav-link" to="/declaration-create">Стать партнёром</router-link>
          </li>

          <li v-if="role === 'customer'" class="nav-item">
            <router-link class="nav-link" to="/search">Перейти к поиску</router-link>
          </li>

          <li v-if="role === 'store'" class="nav-item">
            <router-link class="nav-link" to="/restaurant-create">Добавить заведение</router-link>
          </li>

          <li v-if="role === 'store'" class="nav-item">
            <router-link class="nav-link" to="/user-restaurants">Посмотреть все заведение</router-link>
          </li>
        </ul>

        <div v-if="role === 'customer'" class="nav-item me-3">
          <router-link class="dropdown-item" to="/settings">
            <i class="bi bi-geo-alt">{{ user.address || ' | Местоположение не указано' }}</i>
          </router-link>
        </div>

        <div class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown"
             aria-expanded="false">
            <i class="bi bi-person"> | {{ user.email }}</i>
          </a>
          <ul class="dropdown-menu" aria-labelledby="userDropdown">
            <router-link v-if="!isLoggedIn" class="dropdown-item" to="/register">Регистрация</router-link>
            <router-link v-if="!isLoggedIn" class="dropdown-item" to="/login">Логин</router-link>
            <router-link v-if="isLoggedIn && role === 'customer'" class="dropdown-item" to="/orders/pending">Мои
              заказы
            </router-link>
            <router-link v-if="isLoggedIn && role === 'customer'" class="dropdown-item" to="/settings">Настройки</router-link>
            <li>
              <hr class="dropdown-divider"></hr>
            </li>
            <li><a v-if="isLoggedIn" @click.prevent="preventLogoutUser" class="dropdown-item" href="#">Выйти</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";
import AxiosInstance from "@/services/AxiosInstance.js";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";

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

  methods: {
    ...mapActions(useAuthStore, ["logoutUser"]),

    getUserRole() {
      AxiosInstance.get('/user')
          .then((response) => {
            this.role = response.data.user.role.name;
            this.user = response.data.user;
          })
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

  mounted() {
    this.getUserRole();
  },
}
</script>