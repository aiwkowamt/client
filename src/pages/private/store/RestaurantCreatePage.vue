<template>
<div class="container">
  <form>
    <div class="form-group">
      <label for="name">Name</label>
      <input
          type="text"
          name="name"
          v-model="name"
          class="form-control"
          required
      >
    </div>
    <div class="form-group">
      <label for="address">Address</label>
      <input
          type="text"
          name="address"
          v-model="address"
          class="form-control"
          required
      >
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <input
          type="text"
          name="phone"
          v-model="phone"
          class="form-control"
          required
      >
    </div>
    <div class="form-group">
      <label for="image_path">Image</label>
      <input
          type="text"
          name="image_path"
          v-model="image_path"
          class="form-control"
          required
      >
    </div>

    <button type="submit" class="btn btn-primary" @click.prevent="createRestaurant">Добавить</button>
  </form>
</div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  name: "RestaurantCreatePage",

  data() {
    return {
      name: '',
      address: '',
      phone: '',
      image_path: '',
    };
  },

  methods: {
    createRestaurant(){
      const data = {
        name: this.name,
        address: this.address,
        phone: this.phone,
        image_path: this.image_path,
      };

      AxiosInstance.post('/restaurants', {...data})
    }
  }
}
</script>