<template>
  <div class="container">
    <div class="btn-group" role="group">
      <a @click="filterOrders('all')" :class="{ 'active': selectedStatus === 'all' }" class="btn btn-primary">Все</a>
      <a @click="filterOrders('pending')" :class="{ 'active': selectedStatus === 'pending' }" class="btn btn-primary">Ожидание</a>
      <a @click="filterOrders('processing')" :class="{ 'active': selectedStatus === 'processing' }"
         class="btn btn-primary">Обработка</a>
      <a @click="filterOrders('completed')" :class="{ 'active': selectedStatus === 'completed' }"
         class="btn btn-primary">Завершено</a>
      <a @click="filterOrders('cancelled')" :class="{ 'active': selectedStatus === 'cancelled' }"
         class="btn btn-primary">Отменено</a>
    </div>

    <div v-for="order in filteredOrders" :key="order.id" class="card mb-3">
      <div class="card-header">
        Заказ #{{ order.id }}
      </div>
      <div class="card-body">
        <h5 class="card-title">Статус: {{ order.status }}</h5>
        <p class="card-text">Ресторан: {{ order.dishes[0].restaurant.name }}</p>
        <p class="card-text">Дата создания: {{ formatDateTime(order.created_at) }}</p>
        <h6 class="card-subtitle mb-2 text-muted">Блюда:</h6>
        <ul class="list-group">
          <li v-for="dish in order.dishes" :key="dish.id" class="list-group-item">
            {{ dish.name }} - {{ dish.price }}$
          </li>
        </ul>
        <div>К оплате: {{ calculateTotalCost(order) }}$</div>
        <button
            v-if="order.status === 'completed'"
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            @click="selectOrder(order)"
        >
          Оставить отзыв
        </button>
      </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">{{ selectedRestaurant && selectedRestaurant.name }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>Напишите отзыв о блюдах и обслуживании.</div>
            <textarea
                class="form-control"
                v-model="comment.text"
            ></textarea>
            <div class="container mt-3">
              <div class="rating">
            <span
                v-for="star in stars"
                :key="star"
                :class="{ 'active': star <= comment.grade }"
                @click="selectStar(star)"
                style="cursor: pointer;"
            >
              &#9733;
            </span>
              </div>
              <div id="rating-value" class="mt-2">Вы оценили на {{ comment.grade }} звезд(ы).</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button
                @click="postComment(this.selectedRestaurant.id)"
                type="button"
                class="btn btn-primary"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import router from "@/router.js";

export default {
  data() {
    return {
      selectedStatus: null,
      orders: [],
      stars: [1, 2, 3, 4, 5],
      selectedRestaurant: null,
      comment: {
        grade: 0,
        text: '',
        restaurant_id: null,
      },
    };
  },

  mounted() {
    this.selectedStatus = this.$route.params.status || 'pending';
    this.getOrders();
  },

  methods: {
    selectOrder(order) {
      this.selectedRestaurant = order.dishes[0].restaurant;
    },
    selectStar(star) {
      this.comment.grade = star;
    },
    getOrders() {
      AxiosInstance.get("/user-orders")
          .then((response) => {
            this.orders = response.data.orders;
            this.filterOrders(this.selectedStatus);
          });
    },

    filterOrders(status) {
      this.selectedStatus = status;
      router.push({path: `/orders/${status}`});
    },

    formatDateTime(dateTimeString) {
      const options = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'};
      const formattedDateTime = new Date(dateTimeString).toLocaleString('ru-RU', options);
      return formattedDateTime;
    },

    calculateTotalCost(order) {
      return order.dishes.reduce((total, dish) => total + dish.price, 0);
    },

    postComment(restaurant_id) {
      this.comment.restaurant_id = restaurant_id;
      AxiosInstance.post("/comments", this.comment)
          .then(response => {
            console.log(this.comment);
            this.comment.text = '';
            this.comment.grade = 0;
            this.selectedRestaurant = null;
          })
    },
  },

  computed: {
    filteredOrders() {
      if (this.selectedStatus === 'all') {
        return this.orders;
      } else {
        return this.orders.filter(order => order.status === this.selectedStatus);
      }
    }
  }
};
</script>

<style scoped>
.rating {
  font-size: 50px;
  cursor: pointer;
}

.rating .active {
  color: yellow;
}
</style>