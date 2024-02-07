<template>
  <Header></Header>
  <div class="container">
    <div class="row">

      <div class="col-md-9">
        <div>
          <h1>{{ restaurant ? restaurant.name : 'Загрузка...' }}</h1>
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
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Завершить оформление заказа
          </button>
        </div>
      </div>

      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Подтвердите адресс доставки</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h1>Ваш заказ</h1>
              <h1>{{ restaurant ? restaurant.name : 'Загрузка...' }}</h1>
              <ul class="list-group">
                <li v-for="(item, index) in filteredCart" :key="index" class="list-group-item">
                  <div>Наименование: {{ item.dish.name }} (x{{ item.quantity }})</div>
                  <div>Цена: {{ item.dish.price * item.quantity }}$</div>

                  <button @click="decreaseQuantity(item.dish.id)" type="button" class="btn btn-secondary btn-sm">-
                  </button>
                  <button @click="increaseQuantity(item.dish.id)" type="button" class="btn btn-secondary btn-sm">+
                  </button>
                  <button @click="removeFromCart(item.dish.id)" type="button" class="btn btn-danger btn-sm">Удалить
                  </button>
                </li>
              </ul>
              <div>Общая стоимость: {{ totalCost }}$</div>
              <div class="form-group">
                <label for="address">Адресс</label>
                <input
                    type="text"
                    v-model="address"
                    id="address"
                    class="form-control autocomplete-suggestions"
                    @focus="initAutocomplete"
                >
                <span v-if="addressError" class="text-danger">{{ addressError }}</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Подумать еще</button>
              <button @click="confirmOrder" type="button" class="btn btn-primary" data-bs-dismiss="modal"
                      aria-label="Close">Подтвердить адресс
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";
import router from "@/router.js";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";

export default {
  name: "RestaurantDishesPage",
  mixins: [ValidatorMixin],
  components: {Header},

  props: {
    restaurant_id: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      restaurant: null,
      dishes: [],
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      isCartVisible: true,
      address: '',
      addressError: '',
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
    this.getUserAddress();
  },

  methods: {
    getDishesByRestaurantId(restaurant_id) {
      AxiosInstance.get(`/restaurant-dishes/${restaurant_id}`)
          .then((response) => {
            this.dishes = response.data.dishes;
            this.restaurant = response.data.restaurant;
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

    getUserAddress() {
      AxiosInstance.get('/user')
          .then(response => {
            this.address = response.data.user.address;
          })
    },

    confirmOrder() {
      this.addressError = this.validator(this.address, 'required|min:5|max:50|include:Украина');
      if (!this.addressError) {
        const restaurantFilteredCart = this.cart.filter(item => item.dish.restaurant_id === parseInt(this.restaurant_id));
        const items = restaurantFilteredCart.map(item => ({
          dish_id: item.dish.id,
          quantity: item.quantity
        }))
        const data = {
          restaurant_id: this.restaurant_id,
          items,
        };

        AxiosInstance.post('create-order', data)
            .then(() => {
              this.cart = this.cart.filter(item => item.dish.restaurant_id !== parseInt(this.restaurant_id));
              localStorage.setItem('cart', JSON.stringify(this.cart));

              router.push('/orders/pending');
            })
      }
    },

    initAutocomplete() {
      const input = document.getElementById('address');
      const autocomplete = new google.maps.places.Autocomplete(input);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          this.address = '';
          return;
        }
        this.address = place.formatted_address;
      });
    },
  },
  watch: {
    address(newValue) {
      this.addressError = this.validator(newValue, 'required|min:5|max:50|include:Украина');
    },
  }
};
</script>

<style>
.pac-container {
  z-index: 9999;
}
</style>