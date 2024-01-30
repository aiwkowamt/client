<template>
  <div class="container">
    <h1>Редактирование Ресторана</h1>
    <form>
      <label for="editedName">Название:</label>
      <input v-model="restaurant.name" type="text" id="editedName" class="form-control">

      <label for="editedAddress">Адрес:</label>
      <input v-model="restaurant.address" type="text" id="editedAddress" class="form-control">

      <label for="editedPhone">Телефон:</label>
      <input v-model="restaurant.phone" type="text" id="editedPhone" class="form-control">

      <button type="submit" class="btn btn-primary" @click.prevent="updateRestaurant">Сохранить</button>
      <router-link :to="`/dish-create/${this.id}`">Добавить позицию</router-link>
    </form>

    <div v-if="dishes.length">
      <h2>Блюда в ресторане</h2>
      <ul>
        <li v-for="dish in dishes" :key="dish.id">
          <div>{{ dish.name }}</div>
          <div>{{ dish.price }}</div>
          <div>{{ dish.description }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      restaurant: {
        name: "",
        address: "",
        phone: "",
      },
      dishes: [],
    };
  },

  mounted() {
    this.getRestaurant(this.id);
    this.getRestaurantDishes(this.id);
  },

  methods: {
    getRestaurant(restaurant_id) {
      AxiosInstance.get(`/restaurants/edit/${restaurant_id}`)
          .then((response) => {
            this.restaurant = response.data.restaurant;
          })
    },

    getRestaurantDishes(restaurant_id) {
      AxiosInstance.get(`/restaurant-dishes/${restaurant_id}`)
          .then((response) => {
            this.dishes = response.data.dishes;
          });
    },

    updateRestaurant() {
      AxiosInstance.put(`/restaurants/${this.id}`, this.restaurant)
          .then(() => {
            this.$router.push('/user-restaurants');
          })
    },
  },
};
</script>