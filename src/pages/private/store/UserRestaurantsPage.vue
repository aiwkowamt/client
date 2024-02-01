<template>
  <div class="container">
    <h1>Список Ресторанов</h1>
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        <router-link :to="`/restaurant-edit/${restaurant.id}`">{{ restaurant.name }}</router-link>
        <div>{{ restaurant.address }}</div>
        <div>{{ restaurant.phone }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  name: 'RestaurantsPage',

  data() {
    return {
      restaurants: [],
    };
  },

  mounted() {
    this.getUserRestaurants();
  },

  methods: {
    getUserRestaurants() {
     AxiosInstance.get('/user-restaurants')
         .then((response)=>{
           this.restaurants = response.data.restaurants;
         })
    },
  }
};
</script>