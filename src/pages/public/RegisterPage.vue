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

    <div class="form-group">
      <label for="password" class="form-label">Confirm password</label>
      <input
          type="password"
          name="confirmPassword"
          v-model="confirmPassword"
          class="form-control"
      >
      <div class="text-danger" v-if="confirmPasswordError">{{ confirmPasswordError }}</div>

    </div>

    <div class="form-group">
      <label for="email" class="form-label">First name</label>
      <input
          name="firstName"
          type="text"
          v-model="firstName"
          class="form-control"
      >
      <div class="text-danger" v-if="firstNameError">{{ firstNameError }}</div>
    </div>

    <div class="form-group">
      <label for="email" class="form-label">Second name</label>
      <input
          name="secondName"
          type="text"
          v-model="secondName"
          class="form-control"
      >
      <div class="text-danger" v-if="secondNameError">{{ secondNameError }}</div>

    </div>

    <div class="form-group">
      <label for="email" class="form-label">Address</label>
      <input
          name="address"
          type="text"
          v-model="address"
          class="form-control"
      >
      <div class="text-danger" v-if="addressError">{{ addressError }}</div>

    </div>

    <div class="form-group">
      <label for="email" class="form-label">Phone</label>
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
    sendCredentials() {
      const userData = {
        'email': this.email,
        'password': this.password,
        'confirmPassword': this.confirmPassword,
        'firstName': this.firstName,
        'secondName': this.secondName,
        'address': this.address,
        'phone': this.phone,
      }

      useAuthStore().registerUser(userData);
    },
  },
};

</script>