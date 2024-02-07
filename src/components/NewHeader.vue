<template>
  <nav class="navbar">
    <div class="container">
      <div>FoodDelivery</div>
      <div class="search-input-container">
        <input type="text" class="search-input" placeholder="Поиск" v-model="searchQuery">
        <span v-if="searchQuery" @click="clearSearch" class="clear-icon">&#x2715;</span>
        <i class="bi bi-search search-icon"></i>
      </div>
      <div class="address">Здесь будет находится адресс</div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
    }
  }
}
</script>

<style>
.navbar {
  background-color: gold;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input-container {
  position: relative;
}

.search-icon, .clear-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.search-icon {
  left: 10px;
}

.clear-icon {
  right: 10px;
  cursor: pointer;
}

.search-input {
  border: none;
  border-radius: 25px;
  width: 366px;
  height: 44px;
  padding-left: 40px;
  padding-right: 40px;
  text-align: center;
  font-size: 20px;
  outline: none;
}

.address{
  font-family: "Glovo",Helvetica,Arial,sans-serif;
  font-size: 14px;
  font-weight: 400;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
