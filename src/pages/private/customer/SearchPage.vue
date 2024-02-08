<template>
<!--  <Header></Header>-->
  <NewHeader/>

  <div class="container">
    <!-- Поиск -->
    <form @submit.prevent="searchRestaurants" class="search-form mb-3 mt-3">
      <div class="search-input-container">
        <input type="text" v-model="searchQuery.name" placeholder="Поиск" class="search-input">
        <i v-if="searchQuery.name" class="clear-icon bi bi-x-lg" @click="clearSearch"></i>
      </div>
      <button type="submit" class="search-button"></button>
    </form>

    <!-- Список магазинов -->
    <ul class="list-unstyled">
      <li v-for="restaurant in restaurants" :key="restaurant.id" class="mb-3">
        <div class="card">
          <div class="card-body d-flex">
            <img :src="getRestaurantImageUrl(restaurant.image_path)" class="rounded-circle mr-3" alt="Restaurant Image" style="width: 100px; height: 100px;">
            <div>
              <h3 class="card-title">{{ restaurant.name }}</h3>
              <p class="card-text">{{ restaurant.address }}</p>
              <p class="card-text">Средний рейтинг: {{restaurant.average_rating}}</p>
              <router-link :to="`/restaurant-dishes/${restaurant.id}`" class="btn btn-primary">Перейти</router-link>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Пагинация -->
    <nav v-if="pagination.last_page > 1" aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" v-for="page in pagination.last_page" :key="page" :class="{ 'active': page === pagination.current_page }">
          <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import router from "@/router.js";
import NewHeader from "@/components/NewHeader.vue";
import Header from "@/components/Header.vue";

export default {
  components: {Header, NewHeader},
  data() {
    return {
      restaurants: [],
      pagination: {},
      searchQuery: {
        name: '',
        page: 1,
      },
      averageRatings: {},
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

    clearSearch() {
      this.searchQuery.name = '';
    },
  },
};
</script>

<style>
.search-form {
  display: flex;
  align-items: center;
  position: relative;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  border: none;
  border-radius: 20px;
  padding: 8px 36px 8px 16px;
  width: 300px;
  background-color: white;
  border: 2px solid #ccc;
  border-radius: 20px;
}

.search-input:focus {
  outline: none;
  border-color: #333;
}

.clear-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.search-button {
  display: none;
}

</style>