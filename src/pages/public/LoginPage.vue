<template>
  <form>
    <div class="form-group">
      <label for="email" class="form-label">Email</label>
      <input
          name="email"
          type="email"
          v-model="email"
          class="form-control"
      >
      <div class="text-danger" v-if="emailError">{{ emailError }}</div>
    </div>

    <div class="form-group">
      <label for="password" class="form-label">Password</label>
      <input
          type="password"
          name="password"
          v-model="password"
          class="form-control"
      >
      <div class="text-danger" v-if="passwordError">{{ passwordError }}</div>
    </div>

    <div class="text-danger" v-if="authLoginError">{{ authLoginError }}</div>

    <button class="btn btn-primary" @click.prevent="sendCredentials">Login</button>
  </form>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";

export default {
  name: "LoginPage",

  data() {
    return {
      email: '',
      emailError: null,

      password: '',
      passwordError: null,

      loginError: null,
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["loginUser"]),

    validateEmail() {
      if (!this.email) {
        this.emailError = 'Это поле не должно быть пустым!';
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.emailError = 'Почта имеет неправильный формат!';
      } else {
        this.emailError = null;
      }
    },

    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Это поле не должно быть пустым!';
      } else if (this.password.length < 6 || this.password.length > 20) {
        this.passwordError = 'Пароль должен содержать не менее 6 символов и не больше 20!';
      } else {
        this.passwordError = null;
      }
    },

    sendCredentials() {
      this.validateEmail();
      this.validatePassword();
      if (!this.emailError && !this.passwordError) {
        const userData = {
          'email': this.email,
          'password': this.password,
        }
        this.loginUser(userData);
      }
    },
  },

  computed: {
    authLoginError(){
      return useAuthStore().getLoginError;
    },
  },
};
</script>