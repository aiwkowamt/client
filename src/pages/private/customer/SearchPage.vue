<template>
  <!--  <Header></Header>-->
  <NewHeader/>

  <div class="container">
    <!-- Поиск -->
    <form @submit.prevent="searchRestaurants" class="mb-3 mt-3">
      <div class="row">
        <div class="col">
          <input type="text" v-model="searchQuery.name" id="searchInput" placeholder="Поиск" class="form-control">
          <select v-model="searchQuery.sortBy" id="sortBySelect" class="form-select mt-3">
            <option value="">Сортировка по умолчанию</option>
            <option value="rating">Сортировка по рейтингу</option>
            <option value="orders_count">Сортировка по количеству заказов</option>
          </select>
          <div class="btn-group mt-3"  style="width: 100%;">
            <button type="submit" class="btn btn-warning" style="width: 80%;">Поиск</button>
            <button @click.prevent="clearSearch" class="btn btn-outline-dark">Сбросить</button>
          </div>
        </div>

        <div class="col">
          <select v-model="searchQuery.categories" multiple id="categories" class="form-select" style="height: 100%">
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
      </div>
    </form>


    <!-- Список магазинов -->
    <div class="row" v-if="restaurants && restaurants.length > 0">
      <div class="col-md-4 mb-3" v-for="restaurant in restaurants" :key="restaurant.id">
        <div class="card h-100 position-relative" @click="goToRestaurant(restaurant.id)">

          <img :src="getRestaurantImageUrl(restaurant.image_path)" class="card-img-top" alt="Restaurant Image">

          <div class="rating-badge" :class="calculatePercentage(restaurant.average_rating).colorClass">
            <i class="bi bi-hand-thumbs-up-fill"></i>
            <span class="raiting-text">{{ calculatePercentage(restaurant.average_rating).percentage }} %</span>
            <span class="text-muted" style="font-size: 13px;"> ({{ restaurant.comments_count }})</span>
          </div>

          <div class="card-body">
            <h5 class="card-title">{{ restaurant.name }}</h5>
            <p class="card-text text-muted">{{ restaurant.address }}</p>
          </div>

        </div>
      </div>
    </div>

    <div class="d-flex flex-column align-items-center mt-5" v-else>
      <div>
        <img src="../../../../public/empty_search.png">
        <div @click="clearSearch" class="fs-5 text-uppercase fw-bold text-success mt-3" style="cursor: pointer">Показать все заведения</div>
      </div>
    </div>

    <!-- Пагинация -->
    <nav v-if="pagination.last_page > 1" aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" v-for="page in pagination.last_page" :key="page"
            :class="{ 'active': page === pagination.current_page }">
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
      categories: [],

      pagination: {},
      searchQuery: {
        name: '',
        page: 1,
        sortBy: '',
        categories: [],
      },
      averageRatings: {},
    };
  },

  mounted() {
    const queryParams = this.$route.query;
    this.searchQuery.name = queryParams.name || '';
    this.searchQuery.sortBy = queryParams.sortBy || '';
    this.searchQuery.categories = Array.isArray(queryParams.categories) ? queryParams.categories : (queryParams.categories ? queryParams.categories.split(',') : []);
    this.searchQuery.page = queryParams.page || '';

    this.searchRestaurants();
    this.getCategories();
  },

  methods: {
    searchRestaurants() {
      console.log(this.searchQuery);

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

    calculatePercentage(rating) {
      if (rating !== undefined && rating !== null) {
        const percentage = Math.round((rating / 5) * 100);
        if (percentage >= 1 && percentage <= 20) {
          return {colorClass: 'text-danger', percentage: percentage};
        } else if (percentage > 20 && percentage <= 40) {
          return {colorClass: 'text-warning', percentage: percentage};
        } else if (percentage > 40 && percentage <= 60) {
          return {colorClass: 'text-orange', percentage: percentage};
        } else if (percentage > 60 && percentage <= 80) {
          return {colorClass: 'text-success', percentage: percentage};
        } else if (percentage > 80 && percentage <= 100) {
          return {colorClass: 'text-primary', percentage: percentage};
        }
      }
      return {colorClass: 'text-black', percentage: '?'};
    },

    goToRestaurant(restaurantId) {
      router.push(`/restaurant-dishes/${restaurantId}`);
    },

    getCategories() {
      AxiosInstance.get(`/categories`)
          .then((response) => {
            this.categories = response.data.categories;
          })
    },

    clearSearch() {
      this.searchQuery.name = '';
      this.searchQuery.sortBy = '';
      this.searchQuery.categories = [];
      this.searchQuery.page = '';

      this.searchRestaurants();
    }
  },
};
</script>

<style scoped>

.card-img-top {
  height: 200px;
  object-fit: cover;
  transform-origin: center bottom;
  transition: transform 0.3s ease;
}

.rating-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 20px;
  color: #000;
}

.card-title {
  font-weight: 800;
}

.raiting-text {
  margin-left: 5px;
}

.card {
  border: none;
  overflow: hidden;
  cursor: pointer;
}

.card-body {
  padding: 0;
  margin-top: 10px;
}

.card:hover .card-img-top {
  transform: scale(1.1);
}

</style>