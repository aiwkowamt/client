<template>
  <NewHeader></NewHeader>
<!--  <Header></Header>-->
  <div>
    {{ user && user.email }}
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
    };
  },

  mounted() {
    this.getUser();
    this.rofl();
  },

  methods: {
    getUser() {
      AxiosInstance.get('/user')
          .then(response => {
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

