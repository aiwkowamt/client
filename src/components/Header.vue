<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-success" aria-label="Fourth navbar example">
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

<!--            <li v-if="role === 'customer'" class="nav-item dropdown">-->
<!--              <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown"-->
<!--                 aria-expanded="false">Перейти к заказу</a>-->
<!--              <ul class="dropdown-menu" aria-labelledby="dropdown04">-->
<!--                <li><a class="dropdown-item" href="#">Раз</a></li>-->
<!--                <li><a class="dropdown-item" href="#">Два</a></li>-->
<!--                <li><a class="dropdown-item" href="#">Три</a></li>-->
<!--              </ul>-->
<!--            </li>-->

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
              <router-link v-if="!isLoggedIn" class="dropdown-item" to="/register">Регистрация</router-link>
              <router-link v-if="!isLoggedIn" class="dropdown-item" to="/login">Логин</router-link>
              <router-link v-if="isLoggedIn && role === 'customer'" class="dropdown-item" to="/orders/pending">Мои заказы</router-link>
              <li><hr class="dropdown-divider"></hr></li>
              <li><a v-if="isLoggedIn" @click.prevent="logoutUser" class="dropdown-item" href="#">Выйти</a></li>
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