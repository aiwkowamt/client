<template>
  <!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container shadow p-4 rounded">
    <div class="btn-group mt-3 shadow">
      <button class="btn btn-danger" @click="getPDF" v-if="isVisiblePdfBtn">получить PDF</button>
      <button type="submit" class="btn btn-dark">
        <router-link :to="`/dish-create/${this.id}`" class="text-decoration-none text-white">Добавить позицию
        </router-link>
      </button>
    </div>

    <form enctype="multipart/form-data">
      <div class="form-group mt-3">
        <label for="editedName" class="fw-bold">Название:</label>
        <input v-model="restaurant.name" type="text" id="editedName" class="form-control">
        <div v-if="nameError" class="text-danger">{{ nameError }}</div>
      </div>

      <div class="form-group mt-3">
        <label for="editedAddress" class="fw-bold">Адрес:</label>
        <input type="text" class="form-control"
               v-model="restaurant.address"
               id="address"
               @focus="initAutocomplete"
        >
        <div v-if="addressError" class="text-danger">{{ addressError }}</div>
      </div>

      <div class="form-group mt-3">
        <label for="editedPhone" class="fw-bold">Телефон:</label>
        <input v-model="restaurant.phone" type="text" id="editedPhone" class="form-control">
        <div v-if="phoneError" class="text-danger">{{ phoneError }}</div>
      </div>

      <div class="form-group mt-3">
        <label for="image" class="fw-bold">Заглавное фото</label>
        <input
            type="file"
            @change="handleImageChange($event)"
            class="form-control"
            name="image"
        >
        <div v-if="imageError" class="text-danger">{{ imageError }}</div>

        <img :src="getRestaurantImageUrl(restaurant.image_path)" alt="Restaurant Image"
             style="max-width: 200px; margin-top: 10px;">

      </div>

      <button type="submit" class="btn btn-dark shadow mt-3" @click.prevent="updateRestaurant">Сохранить</button>

    </form>

    <div v-if="dishes.length">
      <h2>Позиции в ресторане</h2>
      <ul>
        <li v-for="dish in dishes" :key="dish.id">
          <div>Наименование: {{ dish.name }}</div>
          <div>Цена: {{ dish.price }}</div>
          <div>Описание: {{ dish.description }}</div>
          <img :src="getRestaurantImageUrl(dish.image_path)" alt="Restaurant Image"
               style="max-width: 200px; margin-top: 10px;">
        </li>
      </ul>
    </div>
    <div v-else>
      <div class="mt-3 text-muted fw-bold fs-5">Добавьте позиции для даного ресторана</div>
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
import Cookies from "js-cookie";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import router from "@/router.js";

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
        name: '',
        address: '',
        phone: '',
        image_path: '',
      },

      image: null,

      nameError: '',
      addressError: '',
      phoneError: '',
      imageError: '',

      dishes: [],
      orders: [],

      isVisiblePdfBtn: false,
    };
  },

  mounted() {
    this.getRestaurant(this.id);
    this.getRestaurantDishes(this.id);
    this.getRestaurantOrders(this.id);

    const token = Cookies.get('token');

    window.Pusher = Pusher;

    window.Echo = new Echo({
      authEndpoint: 'http://localhost:8080/broadcasting/auth',
      broadcaster: 'pusher',
      key: '1b05206a9f85875c6901',
      cluster: 'eu',
      forceTLS: true,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    window.Echo.channel('channel-pdf')
        .listen('PDFGeneration', (event) => {
          const file_url = event.fileUrl;
          this.isVisiblePdfBtn = true;
          AxiosInstance.post('/download-pdf', {file_url}, {responseType: 'blob'})
              .then((response) => {
                let filename = "comments.pdf";
                filename = decodeURI(filename);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
              })
        });
  },

  methods: {
    getRestaurant(restaurant_id) {
      AxiosInstance.get(`/restaurants/edit/${restaurant_id}`)
          .then((response) => {
            this.restaurant = response.data.restaurant;
          })
          .catch((error) => {
                if (error.response && error.response.status === 403) {
                  router.push('/NotFoundPage');
                }
          });
    },

    getRestaurantDishes(restaurant_id) {
      AxiosInstance.get(`/restaurant-dishes/${restaurant_id}`)
          .then((response) => {
            if (response.data.dishes) {
              this.dishes = response.data.dishes;
            }
          });
    },

    getRestaurantOrders(restaurant_id) {
      AxiosInstance.get(`/restaurant-orders/${restaurant_id}`)
          .then((response) => {
            if (response.data.orders) {
              this.orders = response.data.orders;
            }
          });
    },

    updateRestaurant() {
      this.nameError = this.validator(this.restaurant.name, 'required|min:5|max:100');
      this.addressError = this.validator(this.restaurant.address, 'required');
      this.phoneError = this.validator(this.restaurant.phone, 'required|integer|size:10');

      this.addressError = '';
      if (this.restaurant.address.trim() === '') {
        this.addressError = 'Адрес должен быть в Украине';
      } else {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: this.restaurant.address}, (results, status) => {
          if (status !== 'OK') {
            this.addressError = 'Несуществующий адрес';
            return;
          }
          const country = results[0].address_components.find(component =>
              component.types.includes('country') && component.short_name === 'UA'
          );
          if (!country) {
            this.addressError = 'Адрес должен быть в Украине';
            return;
          }
          this.restaurant.address = results[0].formatted_address;


          if (!this.nameError && !this.addressError && !this.phoneError) {
            const confirmed = window.confirm('Вы уверены, что хотите обновить данные?');

            if (confirmed) {
              const data = {
                'name': this.restaurant.name,
                'address': this.restaurant.address,
                'phone': this.restaurant.phone,
              }
              console.log(data);
              AxiosInstance.post(`/restaurants/${this.id}`, {...data})
                  .then(() => {
                    this.$router.push('/user-restaurants');
                  })
            }
          }
        });
      }
    },

    initAutocomplete() {
      const input = document.getElementById('address');
      const options = {
        componentRestrictions: {country: 'ua'},
        fields: ['formatted_address', 'geometry', 'name'],
        strictBounds: true
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.formatted_address) {
          return;
        }
        this.restaurant.address = place.formatted_address;
      });
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
      AxiosInstance.put(`/orders/${orderId}`, {status})
    },

    getPDF() {
      AxiosInstance.get(`/generate-pdf-comments/${this.id}`)
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5242880) {
          this.image = file;
          this.imageError = '';

          const data = {
            'image': this.image
          };
          AxiosInstance.post(`/restaurants/${this.id}`, {...data}, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
              .then((response) => {
                location.reload();
              })

        } else {
          this.imageError = 'Формат изображения должен быть JPEG или PNG, размер не должен превышать 5 МБ';
          this.restaurant.image = null;
          event.target.value = '';
        }
      }
    },

    getRestaurantImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/storage/${imagePath}` : '';
    },
  },

  watch: {
    'restaurant.name'(newValue) {
      this.nameError = this.validator(newValue, 'required|min:5|max:30');
    },
    'restaurant.address'() {
      this.addressError = '';
    },
    'restaurant.phone'(newValue) {
      this.phoneError = this.validator(newValue, 'required|integer|size:10');
    },
  },
};
</script>