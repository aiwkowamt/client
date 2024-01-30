<template>
  <div class="container">

    <div  v-if="declarationStatus === null">
      <form @submit.prevent="submitDeclaration">
        <div class="form-group">
          <label for="description">Описание</label>
          <textarea
              id="description"
              v-model="description"
              class="form-control"
              rows="4"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary mt-2">Отправить</button>
      </form>
    </div>

    <div v-if="declarationStatus === 'pending'">
      <p>Ожидайте рассмотрения заявки</p>
    </div>

    <div v-if="declarationStatus === 'cancelled'">
      <p>К сожалению, ваша заявка отменена!</p>
    </div>

  </div>
</template>

<script>
import AxiosInstance from "@/services/AxiosInstance.js";

export default {
  name: "DeclarationPage",

  data() {
    return {
      description: '',
      declarationStatus: null,
    };
  },

  mounted() {
    this.checkDeclarationStatus();
  },

  methods: {
    submitDeclaration() {
      const data = {
        'description': this.description,
      }

      AxiosInstance.post("/declaration", {...data})
          .then(() => {
            this.declarationStatus = 'pending';
          })
    },

    checkDeclarationStatus() {
      AxiosInstance.get("/check-declaration-status")
          .then((response) => {
            this.declarationStatus = response.data.status;
          })
    },
  },
};
</script>