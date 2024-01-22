<template>
  <div class="container">
    <form @submit.prevent="addRestaurant">
      <div class="form-group">
        <label for="name">Название:</label>
        <input
            class="form-control"
            id="name"
            v-model="restaurant.name"
        >
      </div>

      <div class="form-group">
        <label for="address">Адрес:</label>
        <input
            class="form-control"
            id="address"
            v-model="restaurant.address"
        >
      </div>

      <div class="form-group">
        <label for="phone">Телефон:</label>
        <input
            class="form-control"
            id="phone"
            v-model="restaurant.phone"
        >
      </div>

      <div class="form-group">
        <label for="image_path">Путь к изображению:</label>
        <input
            class="form-control"
            id="image_path"
            v-model="restaurant.image_path"
        >
      </div>

      <button type="submit" class="btn btn-primary">Добавить</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      restaurant: {
        name: '',
        address: '',
        phone: '',
        image_path: '',
      },
    };
  },
  methods: {
    addRestaurant() {
      // Ваш код для отправки данных на сервер, например, используя Axios
      console.log(this.restaurant);
    },
  },
};
</script>