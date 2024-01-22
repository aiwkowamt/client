<template>
  <div class="container">
    <nav class="navbar navbar-expand-md navbar-dark bg-warning" aria-label="Fourth navbar example">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">PalmoFood</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li v-if="userRoleId === 2" class="nav-item">
              <router-link class="nav-link" to="/declaration-page">Стать партнёром</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search-page">Перейти к поиску</router-link>
            </li>
            <li v-if="userRoleId === 3" class="nav-item">
              <router-link class="nav-link" to="/restaurants-page">Перейти к ресторанам</router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false">Перейти к заказу</a>
              <ul class="dropdown-menu" aria-labelledby="dropdown04">
                <li><a class="dropdown-item" href="#">Раз</a></li>
                <li><a class="dropdown-item" href="#">Два</a></li>
                <li><a class="dropdown-item" href="#">Три</a></li>
              </ul>
            </li>
          </ul>

          <a class="nav-link me-2" href="#">
            <i class="bi bi-basket"></i>
            <span class="badge bg-danger ms-2">1</span>
          </a>

          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="userDropdown">
              <router-link class="dropdown-item" to="/register" v-if="!isLoggedIn">Регистрация</router-link>
              <router-link class="dropdown-item" to="/login" v-if="!isLoggedIn">Логин</router-link>

<!--              <li><hr class="dropdown-divider"></hr></li>-->
              <li><a class="dropdown-item" href="#" @click.prevent="logoutUser" v-if="isLoggedIn">Выйти</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";

export default {
  name: "Header",

  methods: {
    ...mapActions(useAuthStore, ["logoutUser"]),
  },

  computed: {
    isLoggedIn() {
      return useAuthStore().loggedIn;
    },
    userRoleId() {
      console.log(useAuthStore().getUserRoleId);
      return useAuthStore().getUserRoleId;
    },
  },
}
</script>