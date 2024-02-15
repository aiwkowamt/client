<template>
  <NewHeader/>
  <!--  <Header></Header>-->
  <div v-if="role === 'customer'" class="container mt-5">
    <img src="../../../public/recommendation.png" alt="Заведения которые могут вам понравиться">
    <span class="fs-3 fw-bold ms-3">Предложения блюд основаны на предварительных заказах и предпочтениях</span>

    <div class="row mt-3" v-if="dishes && dishes.length > 0">
      <div class="col-md-12">
        <div class="row">
          <router-link :to="'/restaurant-dishes/' + dish.restaurant_id" v-for="dish in dishes" :key="dish.id" class="col-md-6 mb-4 text-decoration-none">
            <div class="card h-100">
              <div class="row g-0">
                <div class="col-md-4 p-3">
                  <img :src="getDishImageUrl(dish.image_path)" class="small-image" alt="Фото блюда">
                </div>
                <div class="col-md-8 pt-3 pe-3">
                  <div>
                    <div class="fw-bold fs-5">{{ dish.name }}</div>
                    <div class="bg-warning fw-bold rounded-1 text-center d-inline-block ps-1 pe-1">{{ dish.category.name }}</div>
                    <div class="text-muted">{{ dish.description }}</div>
                    <div>{{ dish.price }}₴</div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="row mt-5" v-else>
      <div class="col-md-12">
        <div class="fs-5 text-muted">Здесь будут ваши рекомендации</div>
      </div>
    </div>

  </div>
  <div v-if="role === 'store'" class="container mt-5">
    <router-link to="/restaurant-create" class="text-decoration-none">
      <h1 class="text-dark">Добавьте своё первое заведение</h1>
    </router-link>
  </div>



  <div class="container mt-3 mb-3">
    <div class="row justify-content-center">
    <div v-if="role === 'customer'" class="partner-block">
      <div class="partner-heading">Стать партнёром</div>
      <img src="../../../public/partner.png" class="partner-image">
      <div class="partner-content">
        <div class="partner-text">
          Ускоряйте рост бизнеса вместе с нами! Наши технологии и база пользователей - идеальный рецепт для увеличения
          продаж и открытия новых возможностей!
        </div>
        <router-link to="/declaration-create" class="partner-link">Регистрация заявки</router-link>
      </div>
    </div>
    </div>
  </div>


</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";
import Header from "@/components/Header.vue";
import NewHeader from "@/components/NewHeader.vue";

export default {
  name: "HomePage",
  components: {Header, NewHeader},
  data() {
    return {
      user: null,
      role: '',
      dishes: [],
    };
  },

  mounted() {
    this.getUser();
    this.getDishRecommendations();
  },

  methods: {
    getUser() {
      AxiosInstance.get('/user')
          .then((response) => {
            this.role = response.data.user.role.name;
            this.user = response.data.user;
          })
    },

    getDishRecommendations() {
      AxiosInstance.get('/dish-recommendations')
          .then((response) => {
            this.dishes = response.data.dishes;
          })
    },

    getDishImageUrl(imagePath) {
      return imagePath ? `http://localhost:8080/storage/${imagePath}` : '';
    },
  }
};
</script>

<style scoped>
.partner-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 300px;
}

.partner-heading {
  font-weight: bold;
  font-size: 35px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}


.partner-image {
  margin: 10px 0;
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.partner-content {
  text-align: center;
}

.partner-link {
  margin: 10px 0;
  display: inline-block;
  padding: 10px;
  background-color: #3CB371;
  color: #ffffff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.partner-link:hover {
  background-color: #45a049;
}

.small-image {
  width: 110px;
  height: 110px;
  border-radius: 10px;
}

.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.03);
  cursor: pointer;
}

</style>