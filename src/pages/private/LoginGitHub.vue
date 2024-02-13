<template>
  <h1>Login with GitHub. Please, wait...</h1>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";

export default {
  name: 'LoginGithub',

  methods: {
    ...mapActions(useAuthStore, ["loginGithubCallback"]),

    loginGH() {
      const code = this.$route.query.code;
      this.loginGithubCallback(code);
    },

  },

  created() {
    this.loginGH();
  },
}
</script>

