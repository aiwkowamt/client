<template>
  <div class="container">
    <form @submit.prevent="createRestaurant" enctype='multipart/form-data'>
      <div class="form-group">
        <label for="name">Name</label>
        <input
            type="text"
            v-model="name"
            class="form-control"
        >
        <span v-if="nameError" class="text-danger">{{ nameError }}</span>
      </div>
      <div class="form-group">
        <label for="address">Address</label>
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
        <label for="phone">Phone</label>
        <input
            type="text"
            v-model="phone"
            class="form-control"
        >
        <span v-if="phoneError" class="text-danger">{{ phoneError }}</span>
      </div>
      <div class="form-group">
        <label for="image">Image</label>
        <input
            type="file"
            @change="handleImageChange($event)"
            class="form-control"
            name="image"
        >
        <span v-if="imageError" class="text-danger">{{ imageError }}</span>
      </div>
      <button type="submit" class="btn btn-primary">Добавить</button>
    </form>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";

export default {
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
    };
  },

  methods: {
    createRestaurant() {
      this.nameError = this.validator(this.name, 'required|min:5|max:10');
      this.addressError = this.validator(this.address, 'required|min:5|max:50|include:Украина');
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

      if (!this.nameError && !this.addressError && !this.phoneError) {
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

    handleImageChange(event) {
      this.image = event.target.files[0];
    },
  }
}
</script>