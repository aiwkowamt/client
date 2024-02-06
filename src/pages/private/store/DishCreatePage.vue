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
        <label for="category">Category</label>
        <select name="category" v-model="selected_category_id" class="form-control" required>
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input
            type="number"
            name="price"
            v-model="price"
            class="form-control"
            required
        >
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
            name="description"
            v-model="description"
            class="form-control"
            required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="image_path">Image Path</label>
        <input
            type="text"
            name="image_path"
            v-model="image_path"
            class="form-control"
            required
        >
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createDish">Submit</button>
    </form>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  name: "DishCreatePage",

  props: {
    restaurant_id: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      name: '',
      description: '',
      price: '',
      image_path: '',
      categories: [],
      selected_category_id: '',
    };
  },

  methods: {
    getCategories() {
      AxiosInstance.get(`/categories`)
          .then((response) => {
            this.categories = response.data.categories;
          })
    },

    createDish() {
      const data = {
        'name': this.name,
        'category_id': this.selected_category_id,
        'restaurant_id': this.restaurant_id,
        'price': this.price,
        'description': this.description,
        'image_path': this.image_path
      }
      AxiosInstance.post('/dish', data)
      this.$router.push(`/restaurant-edit/${this.restaurant_id}`);
    },
  },

  mounted() {
    this.getCategories();
  }
}
</script>