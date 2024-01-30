<template>
  <div class="container">
    <h1>Рестораны</h1>
    <ul>
      <form @submit.prevent="searchRestaurants">
        <input type="text" v-model="searchQuery.name" placeholder="Search">
        <button type="submit">Поиск</button>
      </form>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        {{ restaurant.name }} - {{ restaurant.address }}
        <router-link :to="`/restaurant-dishes/${restaurant.id}`">Перейти</router-link>
      </li>
    </ul>

    <nav v-if="pagination.last_page > 1">
      <ul class="pagination">
<!--        <li :class="{ 'disabled': pagination.current_page === 1 }">-->
<!--          <a @click.prevent="changePage(pagination.current_page - 1)" href="#" aria-label="Previous">-->
<!--            <span aria-hidden="true">&laquo;</span>-->
<!--          </a>-->
<!--        </li>-->
        <li v-for="page in pagination.last_page" :key="page" :class="{ 'active': page === pagination.current_page }">
          <a @click.prevent="changePage(page)" href="#">{{ page }}</a>
        </li>
<!--        <li :class="{ 'disabled': pagination.current_page === pagination.last_page }">-->
<!--          <a @click.prevent="changePage(pagination.current_page + 1)" href="#" aria-label="Next">-->
<!--            <span aria-hidden="true">&raquo;</span>-->
<!--          </a>-->
<!--        </li>-->
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

  watch: {
    '$route.query.name': function (newName, oldName) {
      if (newName !== oldName) {
        this.searchQuery.page = 1;
        this.searchRestaurants();
      }
    }
  },

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
    }
  },
};
</script>