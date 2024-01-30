<template>
  <div class="container">
    <div class="row">
      <div class="col-md-9">
        <div>
          <h1>Блюда ресторана</h1>
          <ul class="list-group">
            <li v-for="dish in dishes" :key="dish.id" class="list-group-item">
              <div>Название: {{ dish.name }}</div>
              <div>Цена: {{ dish.price }}$</div>
              <button @click.prevent="addToCart(dish)" type="button" class="btn btn-primary">+</button>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-3">
        <a class="nav-link me-2" href="#" @click.prevent="toggleCartVisibility">
          <i class="bi bi-basket"></i>
          <span class="badge bg-danger ms-2">{{ totalCount }}</span>
        </a>
        <div v-if="isCartVisible">
          <h1>Ваш заказ</h1>
          <ul class="list-group">
            <li v-for="(item, index) in filteredCart" :key="index" class="list-group-item">
              <div>Наименование: {{ item.dish.name }} (x{{ item.quantity }})</div>
              <div>Цена: {{ item.dish.price * item.quantity }}$</div>

              <button @click="decreaseQuantity(item.dish.id)" type="button" class="btn btn-secondary btn-sm">-</button>
              <button @click="increaseQuantity(item.dish.id)" type="button" class="btn btn-secondary btn-sm">+</button>
              <button @click="removeFromCart(item.dish.id)" type="button" class="btn btn-danger btn-sm">Удалить</button>
            </li>
          </ul>
          <div>Общая стоимость: {{ totalCost }}$</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  name: "RestaurantDishesPage",

  props: {
    restaurant_id: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      dishes: [],
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      isCartVisible: false,
    };
  },

  computed: {
    filteredCart() {
      return this.cart.filter(item => item.dish.restaurant_id === parseInt(this.restaurant_id));
    },

    totalCost() {
      return this.filteredCart.reduce((total, item) => {
        return total + (item.dish.price * item.quantity);
      }, 0);
    },

    totalCount() {
      return this.filteredCart.reduce((total, item) => total + item.quantity, 0);
    },
  },

  mounted() {
    this.getDishesByRestaurantId(this.restaurant_id);
  },

  methods: {
    getDishesByRestaurantId(restaurant_id) {
      AxiosInstance.get(`/restaurant-dishes/${restaurant_id}`)
          .then((response) => {
            this.dishes = response.data.dishes;
          });
    },

    addToCart(dish) {
      const existingIndex = this.cart.findIndex(
          (item) => item.dish.id === dish.id
      );
      if (existingIndex !== -1) {
        this.cart[existingIndex].quantity++;
      } else {
        this.cart.push({dish: dish, quantity: 1});
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    increaseQuantity(dish_id) {
      const index = this.cart.findIndex((item) => item.dish.id === dish_id);
      if (index !== -1) {
        this.cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },

    decreaseQuantity(dish_id) {
      const index = this.cart.findIndex((item) => item.dish.id === dish_id);
      if (index !== -1) {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity--;
        } else {
          this.cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },

    removeFromCart(dish_id) {
      const index = this.cart.findIndex((item) => item.dish.id === dish_id);
      if (index !== -1) {
        this.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },

    toggleCartVisibility() {
      this.isCartVisible = !this.isCartVisible;
    },
  },
};
</script>
