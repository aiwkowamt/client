<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
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
        <p class="card-text">Ресторан: {{
            order && order.dishes && order.dishes.length > 0 && order.dishes[0].restaurant ? order.dishes[0].restaurant.name : 'Ресторан не найден'
          }}</p>
        <p class="card-text">Дата создания: {{ formatDateTime(order.created_at) }}</p>
        <h6 class="card-subtitle mb-2 text-muted">Блюда:</h6>
        <ul class="list-group">
          <li v-for="dish in order.dishes" :key="dish.id" class="list-group-item">
            {{ dish.name }} - {{ dish.price }}$
          </li>
        </ul>
        <div>К оплате: {{ calculateTotalCost(order) }}$</div>
        <button
            v-if="order.status === 'completed' && order.comment_id === null"
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
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              {{ selectedOrder && selectedOrder.dishes[0].restaurant.name }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
              <div>Напишите отзыв о блюдах и обслуживании.</div>
              <textarea
                  class="form-control"
                  v-model="comment.text"
              ></textarea>
              <span v-if="commentTextError" class="text-danger">{{ commentTextError }}</span>
            </div>

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
                <div v-if="commentGradeError" class="text-danger">{{ commentGradeError }}</div>

              </div>
              <div id="rating-value" class="mt-2">Вы оценили на {{ comment.grade }} звезд(ы).</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button
                @click="postComment(this.selectedOrder.id)"
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                aria-label="Close"
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
import Header from "@/components/Header.vue";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import NewHeader from "@/components/NewHeader.vue";

export default {
  components: {NewHeader, Header},
  mixins: [ValidatorMixin],
  data() {
    return {
      selectedStatus: null,
      orders: [],
      stars: [1, 2, 3, 4, 5],
      selectedOrder: null,
      comment: {
        grade: 0,
        text: '',
        order_id: '',
      },
      commentTextError: '',
      commentGradeError: '',
    };
  },

  mounted() {
    this.selectedStatus = this.$route.params.status || 'pending';
    this.getOrders();
  },

  methods: {
    selectOrder(order) {
      this.selectedOrder = order;
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

    postComment() {
      this.commentTextError = this.validator(this.comment.text, 'required|min:10|max:500');
      this.commentGradeError = this.validator(this.comment.grade, 'required|integer');
      if (!this.commentTextError && !this.commentGradeError) {
        this.comment.order_id = this.selectedOrder.id;
        AxiosInstance.post("/comments", {...this.comment})
            .then(response => {
              this.comment.text = '';
              this.comment.grade = 0;
              this.selectedOrder = null;
              router.push("/");
            })
      }
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
  },

  watch: {
    'comment.text': function (newValue) {
      this.commentTextError = this.validator(newValue, 'required|min:10|max:500');
    },
    'comment.grade': function (newValue) {
      this.commentGradeError = this.validator(newValue, 'required|integer');
    },
  },

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