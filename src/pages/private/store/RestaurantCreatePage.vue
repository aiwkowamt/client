<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container">
    <form @submit.prevent="createRestaurant" enctype='multipart/form-data' class="shadow p-3 rounded">
      <div class="form-group">
        <label for="name" class="fw-bold">Название</label>
        <input
            type="text"
            v-model="name"
            class="form-control"
        >
        <span v-if="nameError" class="text-danger">{{ nameError }}</span>
      </div>
      <div class="form-group">
        <label for="address"  class="fw-bold">Адрес</label>
        <input
            type="text"
            v-model="address"
            id="address"
            class="form-control"
            @focus="initAutocomplete"
        >
        <span v-if="addressError" class="text-danger">{{ addressError }}</span>
      </div>
      <div class="form-group">
        <label for="phone" class="fw-bold">Телефон</label>
        <input
            type="text"
            v-model="phone"
            class="form-control"
        >
        <span v-if="phoneError" class="text-danger">{{ phoneError }}</span>
      </div>
      <div class="form-group">
        <label for="image" class="fw-bold">Заглавное фото</label>
        <input
            type="file"
            @change="handleImageChange($event)"
            class="form-control"
            name="image"
        >
        <span v-if="imageError" class="text-danger">{{ imageError }}</span>
        <img v-if="image" :src="imageURL" alt="Selected Image" style="max-width: 200px; margin-top: 10px;">
      </div>
      <button type="submit" class="btn btn-dark mt-3">Добавить</button>
    </form>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import Header from "@/components/Header.vue";
import router from "@/router.js";
import NewHeader from "@/components/NewHeader.vue";

export default {
  components: {NewHeader, Header},
  mixins: [ValidatorMixin],
  data() {
    return {
      name: '',
      address: '',
      phone: '',
      image: null,

      nameError: '',
      addressError: '',
      phoneError: '',
      imageError: '',

      successMessage: '',
    };
  },

  computed: {
    imageURL() {
      return this.image ? URL.createObjectURL(this.image) : '';
    }
  },

  methods: {
    createRestaurant() {
      this.nameError = this.validator(this.name, 'required|min:5|max:10');
      this.phoneError = this.validator(this.phone, 'required|integer|size:10');

      if (!this.image) {
        this.imageError = 'Изображение обязательно для загрузки';
      } else if (!['image/jpeg', 'image/png'].includes(this.image.type)) {
        this.imageError = 'Формат изображения должен быть JPEG или PNG';
      } else if (this.image.size > 5242880) {
        this.imageError = 'Размер изображения не должен превышать 5 МБ';
      } else {
        this.imageError = '';
      }

      if (this.address.trim() === '') {
        this.addressError = 'Адрес должен быть в Украине';
      } else {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: this.address}, (results, status) => {
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
          this.address = results[0].formatted_address;
        });
      }

      if (!this.nameError && !this.addressError && !this.phoneError) {
        const confirmed = window.confirm('Вы уверены, что хотите добавить ресторан?');
        if (confirmed) {
          const data = {
            'name': this.name,
            'address': this.address,
            'phone': this.phone,
            'image': this.image
          };

          AxiosInstance.post('/restaurants', {...data}, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(() => {
            alert('Ресторан успешно добавлен');
            router.push('/user-restaurants');
          })
        }
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
        this.address = place.formatted_address;
      });
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5242880) {
          this.image = file;
          this.imageError = '';
        } else {
          this.imageError = 'Формат изображения должен быть JPEG или PNG, размер не должен превышать 5 МБ';
          this.image = null;
          event.target.value = '';
        }
      }
    },

  },

  watch: {
    name(newValue) {
      this.nameError = this.validator(newValue, 'required|min:5|max:10');
    },
    address() {
      this.addressError = '';
    },
    phone(newValue) {
      this.phoneError = this.validator(newValue, 'required|integer|size:10');
    },
    image(newValue) {
      if (!newValue) {
        this.imageError = 'Изображение обязательно для загрузки';
      } else if (!['image/jpeg', 'image/png'].includes(newValue.type)) {
        this.imageError = 'Формат изображения должен быть JPEG или PNG';
      } else if (newValue.size > 5242880) {
        this.imageError = 'Размер изображения не должен превышать 5 МБ';
      } else {
        this.imageError = '';
      }
    },
  },

}
</script>