<template>
  <div class="container">
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

      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirm password</label>
        <input
            type="password"
            name="confirmPassword"
            v-model="confirmPassword"
            class="form-control"
        >
        <div class="text-danger" v-if="confirmPasswordError">{{ confirmPasswordError }}</div>

      </div>

      <div class="form-group">
        <label for="firstName" class="form-label">First name</label>
        <input
            name="firstName"
            type="text"
            v-model="firstName"
            class="form-control"
        >
        <div class="text-danger" v-if="firstNameError">{{ firstNameError }}</div>
      </div>

      <div class="form-group">
        <label for="secondName" class="form-label">Second name</label>
        <input
            name="secondName"
            type="text"
            v-model="secondName"
            class="form-control"
        >
        <div class="text-danger" v-if="secondNameError">{{ secondNameError }}</div>

      </div>

      <div class="form-group">
        <label for="address" class="form-label">Address</label>
        <input
            name="address"
            type="text"
            v-model="address"
            class="form-control"
        >
        <div class="text-danger" v-if="addressError">{{ addressError }}</div>

      </div>

      <div class="form-group">
        <label for="phone" class="form-label">Phone</label>
        <input
            name="phone"
            type="text"
            v-model="phone"
            class="form-control"
        >
        <div class="text-danger" v-if="phoneError">{{ phoneError }}</div>
      </div>

      <button class="btn btn-primary" @click.prevent="sendCredentials">Register</button>
    </form>
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";

export default {
  name: 'RegisterPage',
  data() {
    return {
      email: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      secondName: null,
      address: null,
      phone: null,

      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
      firstNameError: null,
      secondNameError: null,
      addressError: null,
      phoneError: null,
    }
  },

  methods: {
    ...mapActions(useAuthStore, ["registerUser"]),

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

    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Это поле не должно быть пустым!';
      } else if (this.confirmPassword !== this.password) {
        this.confirmPasswordError = 'Пароли не совпадают!';
      } else {
        this.confirmPasswordError = null;
      }
    },

    validateFirstName() {
      if (!this.firstName) {
        this.firstNameError = 'Это поле не должно быть пустым!';
      } else {
        this.firstNameError = null;
      }
    },

    validateSecondName() {
      if (!this.secondName) {
        this.secondNameError = 'Это поле не должно быть пустым!';
      } else {
        this.secondNameError = null;
      }
    },

    validateAddress() {
      if (!this.address) {
        this.addressError = 'Это поле не должно быть пустым!';
      } else {
        this.addressError = null;
      }
    },

    validatePhone() {
      if (!this.phone) {
        this.phoneError = 'Это поле не должно быть пустым!';
      } else if (!/^\d{10}$/.test(this.phone)) {
        this.phoneError = 'Номер телефона должен содержать 10 цифр!';
      } else {
        this.phoneError = null;
      }
    },

    sendCredentials() {
      if (
          !this.emailError &&
          !this.passwordError &&
          !this.confirmPasswordError &&
          !this.firstNameError &&
          !this.secondNameError &&
          !this.addressError &&
          !this.phoneError
      ) {
        const userData = {
          'email': this.email,
          'password': this.password,
          'confirmPassword': this.confirmPassword,
          'firstName': this.firstName,
          'secondName': this.secondName,
          'address': this.address,
          'phone': this.phone,
        }

        this.registerUser(userData);
      }
    },
  },

  watch: {
    email: 'validateEmail',
    password: 'validatePassword',
    confirmPassword: 'validateConfirmPassword',
    firstName: 'validateFirstName',
    secondName: 'validateSecondName',
    address: 'validateAddress',
    phone: 'validatePhone',
  },

  created() {
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validateFirstName();
    this.validateSecondName();
    this.validateAddress();
    this.validatePhone();
  },
};

</script>