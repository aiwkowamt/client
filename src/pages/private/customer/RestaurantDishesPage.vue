<template>
  <!--  <Header></Header>-->
  <NewHeader></NewHeader>

  <div class="container">
    <div class="row">

      <!--Продукты-->
      <div class="col-md-9">
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="row">
              <div v-for="dish in dishes" :key="dish.id" class="col-md-6 mb-4">
                <div class="card h-100">
                  <div class="row g-0">
                    <div class="col-md-4 p-3">
                      <img :src="getDishImageUrl(dish.image_path)" class="small-image " alt="Фото блюда">
                    </div>
                    <div class="col-md-8 pt-3 pe-3">
                      <div >
                        <div class="fw-bold fs-5">{{ dish.name }}</div>
                        <div class="bg-warning fw-bold rounded-1 text-center d-inline-block ps-1 pe-1">{{ dish.category.name }}</div>
                        <div class="text-muted">{{ dish.description }}</div>
                      </div>
                    </div>
                    <div class="ps-3 pe-3 pb-3">
                      <div class="d-flex justify-content-between">
                        <div>{{ dish.price }}₴</div>
                        <div @click.prevent="addToCart(dish)" class="text-end"><i class="bi bi-plus-lg custom-plus-button"></i></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Корзина-->
      <div class="col-md-3 mt-5">
        <div class="shadow-lg rounded-5 p-3">
          <h2 class="text-center" style="font-weight: 800;">Ваш заказ</h2>
          <ul class="list-group">
            <li v-for="(item, index) in filteredCart" :key="index" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <span class="me-3 fw-bold">{{ item.quantity }}x</span>
                  <span class="me-3">{{ item.dish.name }}</span>
                </div>
                <div>
                  <span>{{ item.dish.price * item.quantity }}₴</span>
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <span @click="decreaseQuantity(item.dish.id)" class="me-3 btn-container"><i
                      class="bi bi-dash-lg custom-minus-button"></i></span>
                  <span @click="removeFromCart(item.dish.id)" class="custom-delete-button fw-bold">Удалить</span>
                </div>
                <div>
                  <span @click="increaseQuantity(item.dish.id)"><i class="bi bi-plus-lg custom-plus-button"></i></span>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="isCartEmpty">
            <img src="../../../../public/empty_cart.png" alt="Пустая корзина" class="img-fluid">
            <div class="text-center">На данный момент в корзине пусто. Добавленные вами продукты будут отображаться
              здесь!
            </div>
          </div>
          <div v-else>
            <div class="custom-complete-button mt-3 d-flex flex-column justify-content-center align-items-center"
                 data-bs-toggle="modal" data-bs-target="#exampleModal">
              Заказать продукты({{ totalQuantity }}) за
              <div>{{ totalCost }}₴</div>
            </div>
          </div>
        </div>
      </div>

      <!--Модалка-->
      <div class="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title fs-4 fw-bold" id="exampleModalLabel">Подтвердите адресс доставки</div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="fs-5">{{ restaurant ? restaurant.name : 'Загрузка...' }} </div>

              <ul class="list-group">
                <li v-for="(item, index) in filteredCart" :key="index" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center mb-2 shadow-sm">
                    <div class="d-flex align-items-center">
                      <span class="me-3 fw-bold">{{ item.quantity }}x</span>
                      <span class="me-3">{{ item.dish.name }}</span>
                    </div>
                    <div>
                      <span>{{ item.dish.price * item.quantity }}₴</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div>К оплате: <span class="fw-bold">{{ totalCost }}₴</span></div>
              <div class="form-group">
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
              <div data-bs-dismiss="modal" class="custom-btn-think">Подумать еще</div>
              <div @click="confirmOrder" data-bs-dismiss="modal" aria-label="Close" class="custom-btn-address">Подтвердить адресс</div>
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
import NewHeader from "@/components/NewHeader.vue";

export default {
  name: "RestaurantDishesPage",
  mixins: [ValidatorMixin],
  components: {NewHeader, Header},

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
      address: '',
      addressError: '',
    };
  },

  computed: {
    filteredCart() {
      return this.cart.filter(item => item.dish.restaurant_id === parseInt(this.restaurant_id));
    },

    isCartEmpty() {
      return this.filteredCart.length === 0;
    },

    totalCost() {
      return this.filteredCart.reduce((total, item) => {
        return total + (item.dish.price * item.quantity);
      }, 0);
    },

    totalQuantity() {
      return this.filteredCart.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
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

    getUserAddress() {
      AxiosInstance.get('/user')
          .then(response => {
            this.address = response.data.user.address;
          })
    },

    confirmOrder() {
      this.addressError = this.validator(this.address, 'required|min:5|max:50');
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

    getDishImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/storage/${imagePath}` : '';
    },
  },
  watch: {
    address(newValue) {
      this.addressError = this.validator(newValue, 'required|min:5|max:50');
    },
  }
};
</script>

<style scoped>

.list-group-item {
  border: none;
}

.custom-minus-button,
.custom-plus-button {
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  background-color: #F5F5F5;
}

.custom-minus-button:hover,
.custom-plus-button:hover {
  background-color: #FFF0F5;
}

.custom-delete-button {
  color: lightseagreen;
  cursor: pointer;
}

.custom-delete-button:hover {
  color: #008080;
}

.custom-complete-button {
  background-color: #20B2AA;
  color: #fff;
  text-align: center;
  border-radius: 24px;
  font-size: 18px;
  font-weight: 800;
  height: 48px;
  cursor: pointer;
}

.custom-complete-button:hover {
  background-color: #66CDAA;
}

.small-image {
  width: 110px;
  height: 110px;
  border-radius: 10px;
}

.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.03);
  cursor: pointer;
}
.custom-btn-think:hover{
  cursor: pointer;
  background-color: #DCDCDC;
}
.custom-btn-address:hover{
  cursor: pointer;
  background-color: #66CDAA;
}

.custom-btn-think{
  background-color: #F5F5F5;
  color: black;
  text-align: center;
  border-radius: 24px;
  font-size: 16px;
  padding: 3px;
}
.custom-btn-address{
  background-color: #20B2AA;
  color: #fff;
  text-align: center;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  padding: 3px;
}


</style>