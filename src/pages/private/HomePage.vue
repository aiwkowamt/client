<template>
  <NewHeader/>
  <!--  <Header></Header>-->
  <div class="footer">
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
    };
  },

  mounted() {
    this.getUser();
    this.rofl();
  },

  methods: {
    getUser() {
      AxiosInstance.get('/user')
          .then((response) => {
            this.role = response.data.user.role.name;
            this.user = response.data.user;
          })
    },
    rofl() {
      const origin = 'Славянск, Донецкая область, Украина';
      const destination = 'Краматорск, Донецкая область, Украина';

      const service = new google.maps.DistanceMatrixService();

      const request = {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING', // или 'WALKING', 'BICYCLING', 'TRANSIT'
      };

      service.getDistanceMatrix(request, (response) => {
        const distance = response.rows[0].elements[0].distance.text;
        const duration = response.rows[0].elements[0].duration.text;

        console.log('Расстояние:', distance);
        console.log('Время:', duration);

      });

    }
  }
};
</script>

<style>
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
  background-color: #45a049; /* Зеленый цвет кнопки при наведении */
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f9fa;
}
</style>