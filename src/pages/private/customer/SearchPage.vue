<template>
  <div class="container">
    <ul>
      <form @submit.prevent="searchRestaurants">
        <input type="text" v-model="searchQuery.name" placeholder="Search">
        <button type="submit">Поиск</button>
      </form>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        <div class="restaurant-card">
          <img :src="getRestaurantImageUrl(restaurant.image_path)" class="card-img-top" alt="Restaurant Image">
          <div class="restaurant-details">
            <h3>{{ restaurant.name }}</h3>
            <p>{{ restaurant.address }}</p>
            <router-link :to="`/restaurant-dishes/${restaurant.id}`">Перейти</router-link>
          </div>
        </div>
      </li>
    </ul>

    <nav v-if="pagination.last_page > 1">
      <ul class="pagination">
        <li v-for="page in pagination.last_page" :key="page" :class="{ 'active': page === pagination.current_page }">
          <a @click.prevent="changePage(page)" href="#">{{ page }}</a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import router from "@/router.js";

export default {
  data() {
    return {
      restaurants: [],
      pagination: {},
      searchQuery: {
        name: '',
        page: 1,
      },
    };
  },

  mounted() {
    const queryParams = this.$route.query;
    this.searchQuery.name = queryParams.name || '';
    this.searchQuery.page = queryParams.page || '';

    this.searchRestaurants();
  },

  // watch: {
  //   '$route.query.name': function (newName, oldName) {
  //     if (newName !== oldName) {
  //       this.searchQuery.page = 1;
  //       this.searchRestaurants();
  //     }
  //   }
  // },

  methods: {
    searchRestaurants() {
      AxiosInstance.get(`/restaurants-search`, {params: this.searchQuery})
          .then(response => {
            this.restaurants = response.data.restaurants.data;
            this.pagination = response.data.restaurants;

            router.push({query: this.searchQuery});
          })
    },

    changePage(page) {
      this.searchQuery.page = page;

      AxiosInstance.get(`/restaurants-search`, {params: this.searchQuery})
          .then(response => {
            this.restaurants = response.data.restaurants.data;
            this.pagination = response.data.restaurants;

            router.push({query: this.searchQuery});
          })
    },

    getRestaurantImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/storage/${imagePath}` : '';
    },

  },
};
</script>