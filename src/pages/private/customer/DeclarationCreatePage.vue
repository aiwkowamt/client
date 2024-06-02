<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
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

    <div v-if="descriptionError">
      {{ descriptionError }}
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
import Header from "@/components/Header.vue";
import NewHeader from "@/components/NewHeader.vue";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";

export default {
  name: "DeclarationPage",
  components: {NewHeader, Header},
  mixins: [ValidatorMixin],
  data() {
    return {
      description: '',
      descriptionError: '',
      declarationStatus: null,
    };
  },

  mounted() {
    this.checkDeclarationStatus();
  },

  methods: {
    submitDeclaration() {
      this.descriptionError = this.validator(this.descriptionError, 'required|min:10|max:255');

      if(!this.descriptionError){
        const data = {
          'description': this.description,
        }

        AxiosInstance.post("/declaration", {...data})
            .then(() => {
              this.declarationStatus = 'pending';
            })
      }
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