<template>
  <Header></Header>
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

export default {
  mixins: [ValidatorMixin],
  components: {Header},

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
      const autocomplete = new google.maps.places.Autocomplete(input);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          this.user.address = '';
          return;
        }
        this.user.address = place.formatted_address;
      });
    },

    editUser() {
      this.addressError = this.validator(this.user.address, 'required|min:5|max:50|include:Украина');
      this.phoneError = this.validator(this.user.phone, 'required|integer|size:10')
      if (!this.addressError && !this.phoneError) {
        console.log(this.user);
        AxiosInstance.put(`/user/${this.user.id}`, this.user)
      }
    },
  },
};
</script>
