<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container">
    <button class="btn btn-primary" @click="getPDF">PDF комментарии</button>
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

    <div v-for="order in orders" :key="order.id" class="card mb-3">
      <div class="card-header">
        Заказ #{{ order.id }}
        <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)" class="form-control">
          <option value="pending">Ожидает</option>
          <option value="processing">Обрабатывается</option>
          <option value="cancelled">Отменен</option>
          <option value="completed">Завершен</option>
        </select>
      </div>
      <div class="card-body">
        <p class="card-text">Дата создания: {{ formatDateTime(order.created_at) }}</p>
        <h6 class="card-subtitle mb-2 text-muted">Блюда:</h6>
        <ul class="list-group">
          <li v-for="dish in order.dishes" :key="dish.id" class="list-group-item">
            {{ dish.name }} - {{ dish.price }}$
          </li>
        </ul>
        <div>Общая стоимость: {{ calculateTotalCost(order) }}$</div>
      </div>
    </div>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import NewHeader from "@/components/NewHeader.vue";

export default {
  mixins: [ValidatorMixin],
  components: {NewHeader, Header},
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
      orders: [],
    };
  },

  mounted() {
    this.getRestaurant(this.id);
    this.getRestaurantDishes(this.id);
    this.getRestaurantOrders(this.id);
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

    getRestaurantOrders(restaurant_id) {
      AxiosInstance.get(`/restaurant-orders/${restaurant_id}`)
          .then((response) => {
            this.orders = response.data.orders;
          });
    },

    updateRestaurant() {
      AxiosInstance.put(`/restaurants/${this.id}`, this.restaurant)
          .then(() => {
            this.$router.push('/user-restaurants');
          })
    },

    formatDateTime(dateTimeString) {
      const options = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'};
      const formattedDateTime = new Date(dateTimeString).toLocaleString('ru-RU', options);
      return formattedDateTime;
    },
    calculateTotalCost(order) {
      return order.dishes.reduce((total, dish) => total + dish.price, 0);
    },

    updateOrderStatus(orderId, status) {
      AxiosInstance.put(`/orders/${orderId}`, { status })
    },

    getPDF(){
      const restaurant_id = this.id
      console.log(restaurant_id);
      AxiosInstance.get('/generate-pdf-comments', restaurant_id)
          .then((response)=>{
            console.log(response.data);
          });
    }
  },
};
</script>