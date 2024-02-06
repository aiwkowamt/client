<template>
  <Header></Header>
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

<!--      <div class="text-danger" v-if="authLoginError">{{ authLoginError }}</div>-->

      <button class="btn btn-primary" @click.prevent="sendCredentials">Login</button>
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
      email: '',
      password: '',
      passwordError: null,
      emailError: null,

      // authLoginError: null,
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["loginUser"]),

    sendCredentials() {
      this.emailError = this.validator(this.email, 'required|email|min:5');
      this.passwordError = this.validator(this.password, 'required|min:5');
      if (!this.emailError && !this.passwordError) {
        const userData = {
          'email': this.email,
          'password': this.password,
        }
        this.loginUser(userData);
      }
    },
  },

  watch: {
    email(newValue) {
      this.emailError = this.validator(newValue, 'required|email|min:5|max:30');
    },

    password(newValue) {
      this.passwordError = this.validator(newValue, 'required|min:5|max:30');
    },
  },

  // computed: {
  //   authLoginError() {
  //     return useAuthStore().getLoginError;
  //   },
  // },
};
</script>