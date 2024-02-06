<template>
  <Header></Header>
  <div class="container">
    <form>
      <div class="form-group">
        <label for="email" class="form-label">Почта</label>
        <input
            name="email"
            type="email"
            v-model="email"
            class="form-control"
            placeholder="Введите почту"
        >
        <div class="text-danger" v-if="emailError">{{ emailError }}</div>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Пароль</label>
        <input
            type="password"
            name="password"
            v-model="password"
            class="form-control"
            placeholder="Введите пароль"

        >
        <div class="text-danger" v-if="passwordError">{{ passwordError }}</div>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="form-label">Повторите пароль</label>
        <input
            type="password"
            name="confirmPassword"
            v-model="confirmPassword"
            class="form-control"
            placeholder="Введите пароль ещё раз"
        >
        <div class="text-danger" v-if="confirmPasswordError">{{ confirmPasswordError }}</div>
      </div>

      <div class="form-group">
        <label for="phone" class="form-label">Phone</label>
        <input
            name="phone"
            type="text"
            v-model="phone"
            class="form-control"
            placeholder="Введите номер в формате (XXX)-XXX-XX-XX"
        >
        <div class="text-danger" v-if="phoneError">{{ phoneError }}</div>
      </div>

      <button class="btn btn-primary" @click.prevent="sendCredentials">Регистрация</button>
    </form>
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import Header from "@/components/Header.vue";

export default {
  components: {Header},
  mixins: [ValidatorMixin],
  data() {
    return {
      email: null,
      password: null,
      confirmPassword: null,
      phone: null,

      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
      phoneError: null,
    }
  },

  methods: {
    ...mapActions(useAuthStore, ["registerUser"]),

    sendCredentials() {
      this.emailError = this.validator(this.email, 'required|email|min:5|max:30');
      this.passwordError = this.validator(this.password, 'required|min:5|max:30');
      this.phoneError = this.validator(this.phone, 'required|integer|size:10');
      if(this.password !== this.confirmPassword){
        this.confirmPasswordError = 'Пароли не совпадают';
      }

      if(!this.emailError && !this.passwordError && !this.phoneError && !this.confirmPasswordError){
        const userData = {
          'email': this.email,
          'password': this.password,
          'phone': this.phone,
        }
        this.registerUser(userData);
      }
    }
  },

  watch: {
    email(newValue) {
      this.emailError = this.validator(newValue, 'required|email|min:5|max:30');
    },

    password(newValue) {
      this.passwordError = this.validator(newValue, 'required|min:5|max:30');
    },

    confirmPassword(newValue) {
      if(this.password && newValue !== this.password) {
        this.confirmPasswordError = 'Пароли не совпадают';
      } else {
        this.confirmPasswordError = null;
      }
    },

    phone(newValue) {
      this.phoneError = this.validator(newValue, 'required|integer|size:10');
    }
  }
};
</script>
