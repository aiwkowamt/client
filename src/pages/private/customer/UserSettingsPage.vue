<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="form-group">
          <label for="address">Адресс</label>
          <input
              type="text"
              v-model="user.address"
              id="address"
              class="form-control"
              @focus="initAutocomplete"
          >
          <span v-if="addressError" class="text-danger">{{ addressError }}</span>
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">Телефон</label>
          <input
              type="text"
              v-model="user.phone"
              id="phone"
              class="form-control"
              placeholder="Введите телефон"
          >
          <span v-if="phoneError" class="text-danger">{{ phoneError }}</span>
        </div>

        <button class="btn btn-primary" @click="editUser">Изменить</button>
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

  data() {
    return {
      addressError: '',
      phoneError: '',
      user: {
        address: '',
        phone: '',
        id: '',
      },
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      AxiosInstance.get("/user")
          .then((response) => {
            this.user = response.data.user;
          })
    },

    initAutocomplete() {
      const input = document.getElementById('address');
      const options = {
        componentRestrictions: { country: 'ua' },
        fields: ['formatted_address', 'geometry', 'name'],
        strictBounds: true
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          this.address = '';
          return;
        }
        this.address = place.formatted_address;
      });
    },

    editUser() {
      if (this.user.address) {
        // Используем геокодирование для получения информации о местоположении
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.user.address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            // Проверяем страну полученного местоположения
            const country = results[0].address_components.find(component =>
                component.types.includes('country') && component.short_name === 'UA'
            );
            if (!country) {
              // Если страна не Украина, устанавливаем ошибку адреса
              this.addressError = 'Адрес должен быть в Украине';
              return;
            }
            // Если адрес в Украине, выполняем обновление пользователя
            this.addressError = '';
            this.updateUser();
          } else {
            // Если геокодирование не удалось, устанавливаем ошибку адреса
            this.addressError = 'Неправильный адрес';
          }
        });
      } else {
        this.updateUser();
      }
    },
    updateUser() {
      this.phoneError = this.validator(this.user.phone, 'required|integer|size:10')
      if (!this.addressError && !this.phoneError) {
        console.log(this.user);
        AxiosInstance.put(`/user/${this.user.id}`, this.user)
            .then(() => {
              // Обработка успешного обновления пользователя
            })
            .catch(error => {
              // Обработка ошибки при обновлении пользователя
            });
      }
    },
  },
};
</script>
