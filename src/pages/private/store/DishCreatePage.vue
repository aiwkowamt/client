<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container">
    <form class="mt-3 p-3 shadow rounded">
      <div class="form-group mt-3">
        <label for="name">Наименование</label>
        <input
            type="text"
            name="name"
            v-model="name"
            class="form-control"
        >
        <span v-if="nameError" class="text-danger">{{ nameError }}</span>
      </div>
      <div class="form-group mt-3">
        <label for="category">Категория</label>
        <select name="category" v-model="selected_category_id" class="form-control" required>
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <span v-if="categoryError" class="text-danger">{{ categoryError }}</span>
      </div>
      <div class="form-group mt-3">
        <label for="price">Цена</label>
        <input
            type="number"
            name="price"
            v-model="price"
            class="form-control"
        >
        <span v-if="priceError" class="text-danger">{{ priceError }}</span>
      </div>
      <div class="form-group mt-3">
        <label for="description">Описание</label>
        <textarea
            name="description"
            v-model="description"
            class="form-control"
        ></textarea>
        <span v-if="descriptionError" class="text-danger">{{ descriptionError }}</span>
      </div>
      <div class="form-group mt-3">
        <label for="image">Заглавное фото</label>
        <input
            type="file"
            @change="handleImageChange($event)"
            class="form-control"
            name="image"
        >
        <span v-if="imageError" class="text-danger">{{ imageError }}</span>
        <img v-if="image" :src="imageURL" alt="Selected Image" style="max-width: 200px; margin-top: 10px;">
      </div>
      <button type="submit" class="btn btn-dark mt-3" @click.prevent="createDish">Добавить</button>
    </form>
  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import NewHeader from "@/components/NewHeader.vue";

export default {
  mixins: [ValidatorMixin],
  name: "DishCreatePage",
  components: {NewHeader, Header},

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
      image: '',
      categories: [],
      selected_category_id: '',

      nameError: '',
      descriptionError: '',
      priceError: '',
      imageError: '',
      categoryError: '',
    };
  },

  computed: {
    imageURL() {
      return this.image ? URL.createObjectURL(this.image) : '';
    }
  },

  methods: {
    getCategories() {
      AxiosInstance.get(`/categories`)
          .then((response) => {
            this.categories = response.data.categories;
          })
    },

    createDish() {
      this.nameError = this.validator(this.name, 'required|min:5|max:100');
      this.descriptionError = this.validator(this.description, 'required|min:10|max:500')
      this.priceError = this.validator(this.price, 'required|integer')
      this.categoryError = this.validator(this.selected_category_id, 'integer');
      if (!this.image) {
        this.imageError = 'Изображение обязательно для загрузки';
      } else if (!['image/jpeg', 'image/png'].includes(this.image.type)) {
        this.imageError = 'Формат изображения должен быть JPEG или PNG';
      } else if (this.image.size > 5242880) {
        this.imageError = 'Размер изображения не должен превышать 5 МБ';
      } else {
        this.imageError = '';
      }

      if (!this.nameError && !this.descriptionError && !this.priceError && !this.categoryError && !this.imageError) {
        const confirmed = window.confirm('Вы уверены, что хотите добавить эту позицию?');
        if (confirmed) {
          const data = {
            'name': this.name,
            'category_id': this.selected_category_id,
            'restaurant_id': this.restaurant_id,
            'price': this.price,
            'description': this.description,
            'image': this.image,
          }
          AxiosInstance.post('/dish', {...data}, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
          this.$router.push(`/restaurant-edit/${this.restaurant_id}`);
        }
      }
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

  mounted() {
    this.getCategories();
  },

  watch: {
    name(newValue) {
      this.nameError = this.validator(newValue, 'required|min:5|max:100');
    },
    description(newValue) {
      this.descriptionError = this.validator(newValue, 'required|min:10|max:500');
    },
    price(newValue) {
      this.priceError = this.validator(newValue, 'required|integer');
    },
    selected_category_id(newValue) {
      this.categoryError = this.validator(newValue, 'integer');
    },
  },
}
</script>