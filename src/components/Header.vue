<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-info" aria-label="Fourth navbar example">
      <div class="container">
        <router-link class="navbar-brand" to="/">PalmoFood</router-link>
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

            <li v-if="role === 'customer'" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown"
                 aria-expanded="false">Перейти к заказу</a>
              <ul class="dropdown-menu" aria-labelledby="dropdown04">
                <li><a class="dropdown-item" href="#">Раз</a></li>
                <li><a class="dropdown-item" href="#">Два</a></li>
                <li><a class="dropdown-item" href="#">Три</a></li>
              </ul>
            </li>

            <li v-if="role === 'store'" class="nav-item">
              <router-link class="nav-link" to="/restaurant-create">Добавить заведение</router-link>
            </li>

            <li v-if="role === 'store'" class="nav-item">
              <router-link class="nav-link" to="/user-restaurants">Посмотреть все заведение</router-link>
            </li>
          </ul>

          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown"
               aria-expanded="false">
              <i class="bi bi-person"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="userDropdown">
              <router-link class="dropdown-item" to="/register" v-if="!isLoggedIn">Регистрация</router-link>
              <li>
                <hr class="dropdown-divider" v-if="!isLoggedIn"></hr>
              </li>
              <router-link class="dropdown-item" to="/login" v-if="!isLoggedIn">Логин</router-link>


              <li><a class="dropdown-item" href="#" @click.prevent="logoutUser" v-if="isLoggedIn">Выйти</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";

export default {
  name: "Header",

  data() {
    return {
      role: null,
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["logoutUser", "getUserRole"]),
  },

  computed: {
    isLoggedIn() {
      return useAuthStore().loggedIn;
    },
  },

  async mounted() {
    this.role = await this.getUserRole();
  }
}
</script>