<template>
  <div class="container">
    <div class="rating">
      <span
          v-for="star in stars"
          :key="star"
          :class="{ 'active': star <= selectedStar }"
          @click="selectStar(star)"
      >
        &#9733;
      </span>
    </div>
    <div id="rating-value">Вы оценили на {{ selectedStar }} звезд(ы).</div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      stars: [1, 2, 3, 4, 5],
      selectedStar: 0
    };
  },
  methods: {
    selectStar(star) {
      this.selectedStar = star;
    }
  }
};
</script>

<style scoped>
.rating {
  font-size: 50px;
  cursor: pointer;
}

.rating .active {
  color: yellow;
}
</style>
