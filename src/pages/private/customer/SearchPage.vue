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
    <div class="row">
      <div class="col-md-4 mb-3" v-for="restaurant in restaurants" :key="restaurant.id">
        <div class="card h-100 position-relative" @click="goToRestaurant(restaurant.id)">

          <img :src="getRestaurantImageUrl(restaurant.image_path)" class="card-img-top" alt="Restaurant Image">

          <div class="rating-badge" :class="calculatePercentage(restaurant.average_rating).colorClass">
            <i class="bi bi-hand-thumbs-up-fill"></i>
            <span class="raiting-text">{{ calculatePercentage(restaurant.average_rating).percentage }} %</span>
          </div>

          <div class="card-body">
            <h5 class="card-title">{{ restaurant.name }}</h5>
            <p class="card-text text-muted">{{ restaurant.address }}</p>
          </div>

        </div>
      </div>
    </div>

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

    calculatePercentage(rating) {
      if (rating !== undefined && rating !== null) {
        const percentage = Math.round((rating / 5) * 100);
        if (percentage >= 1 && percentage <= 20) {
          return { colorClass: 'text-danger', percentage: percentage };
        } else if (percentage > 20 && percentage <= 40) {
          return { colorClass: 'text-warning', percentage: percentage };
        } else if (percentage > 40 && percentage <= 60) {
          return { colorClass: 'text-orange', percentage: percentage };
        } else if (percentage > 60 && percentage <= 80) {
          return { colorClass: 'text-success', percentage: percentage };
        } else if (percentage > 80 && percentage <= 100) {
          return { colorClass: 'text-primary', percentage: percentage };
        }
      }
      return { colorClass: 'text-black', percentage: '?' };
    },

    goToRestaurant(restaurantId) {
      router.push(`/restaurant-dishes/${restaurantId}`);
    },
  },
};
</script>

<style scoped>
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

.card-title{
  font-weight: 800;
}

.raiting-text{
  margin-left: 5px;
}

.card {
  border: none;
  overflow: hidden;
  cursor: pointer;
}

.card-body{
  padding: 0;
  margin-top: 10px;
}

.card:hover .card-img-top {
  transform: scale(1.1);
}

</style>