<template>
  <!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container shadow pt-3 pb-3 rounded">
        <div class="form-group">
          <label for="address" class="fw-bold mt-1">Адресс</label>
          <input
              type="text"
              v-model="user.address"
              id="address"
              class="form-control"
              @focus="initAutocomplete"
          >
          <span v-if="addressError" class="text-danger">{{ addressError }}</span>
        </div>

        <div class="mb-3 mt-3">
          <label for="phone" class="fw-bold">Телефон</label>
          <input
              type="text"
              v-model="user.phone"
              id="phone"
              class="form-control"
              placeholder="Введите телефон"
          >
          <span v-if="phoneError" class="text-danger">{{ phoneError }}</span>
        </div>

        <button class="btn btn-dark mt-1" @click="editUser">Изменить</button>

      </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import NewHeader from "@/components/NewHeader.vue";
import router from "@/router.js";

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
        this.user.address = place.formatted_address;
      });
    },

    editUser() {
      this.addressError = '';
      if (this.user.address.trim() === '') {
        this.addressError = 'Адрес должен быть в Украине';
      } else {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: this.user.address}, (results, status) => {
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
          this.user.address = results[0].formatted_address;
          this.updateUser();
        });
      }
    },

    updateUser() {
      this.phoneError = this.validator(this.user.phone, 'required|integer|size:10')
      if (!this.addressError && !this.phoneError) {
        console.log(this.user);
        AxiosInstance.put(`/user/${this.user.id}`, this.user)
            .then(()=>{
              alert('Успешное изменение');
              router.push('/');
            })
      }
    },
  },

  watch: {
    'user.address'(newValue, oldValue) {
      this.addressError = '';
    },
  },
};
</script>
