<template>
  <Header></Header>
  <div>
    {{ user && user.email}}
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";

export default {
  name: "HomePage",
  components: {Header},
  data() {
    return {
     user: null,
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      AxiosInstance.get('/user')
          .then(response => {
            this.user = response.data.user;
          })
    },
  }
};
</script>

