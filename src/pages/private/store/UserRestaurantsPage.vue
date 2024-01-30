<template>
  <div class="container">
    <h1>Список Ресторанов</h1>
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        <div>{{ restaurant.name }}</div>
        <div>{{ restaurant.address }}</div>
        <div>{{ restaurant.phone }}</div>
        <router-link :to="`/restaurant-edit/${restaurant.id}`">Редактировать</router-link>
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