<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container mt-3">
    <div class="row" v-if="restaurants.length > 0">
      <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-md-4 mb-4">
        <div class="card">
          <img :src="getRestaurantImageUrl(restaurant.image_path)" class="card-img-top" alt="Restaurant Image">
          <div class="card-body">
            <h5 class="card-title"><router-link :to="`/restaurant-edit/${restaurant.id}`" class="text-decoration-none text-dark fw-bold">{{ restaurant.name }}</router-link></h5>
            <p class="card-text">{{ restaurant.address }}</p>
            <p class="card-text">{{ restaurant.phone }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Здесь будут отображаться ваши заведения</h1>
    </div>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";
import NewHeader from "@/components/NewHeader.vue";

export default {
  components: {NewHeader, Header},
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
    getRestaurantImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/storage/${imagePath}` : '';
    },
  }
};
</script>