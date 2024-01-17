<template>
  <div>
    <h1>Рестораны</h1>
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        {{ restaurant.name }} - {{ restaurant.address }}
      </li>
    </ul>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  data() {
    return {
      restaurants: [],
    };
  },
  mounted() {
    this.getRestaurants();
  },
  methods: {
    getRestaurants() {
      AxiosInstance.get('/restaurants')
          .then((response) => {
            this.restaurants = response.data.restaurants;
          })
          .catch(error => {
            console.error('Error getRestaurants():', error);
          });
    },
  },
};
</script>