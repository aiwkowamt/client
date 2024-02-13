<template>
<!--  <Header></Header>-->
  <NewHeader></NewHeader>
  <div class="container mt-3">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="font-weight-bold text-center mb-4">Логин</h2>
            <form>
              <div class="form-group">
                <label for="email" class="font-weight-bold">Почта</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                  </div>
                  <input
                      name="email"
                      type="email"
                      v-model="email"
                      class="form-control"
                      placeholder="Введите вашу почту"
                  >
                </div>
                <div class="text-danger" v-if="emailError">{{ emailError }}</div>
              </div>

              <div class="form-group">
                <label for="password" class="font-weight-bold">Пароль</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                  </div>
                  <input
                      type="password"
                      name="password"
                      v-model="password"
                      class="form-control"
                      placeholder="Введите ваш пароль"
                  >
                </div>
                <div class="text-danger" v-if="passwordError">{{ passwordError }}</div>
              </div>
              <div class="text-danger" v-if="authLoginError">{{ authLoginError }}</div>

              <img src="../../../public/github_logo.png" style="width:40px; height:40px; cursor:pointer;" class="mt-3" @click="github">

              <button class="btn btn-primary w-100 mt-3 shadow" @click.prevent="sendCredentials">LOGIN</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/Auth.js";
import {mapActions} from "pinia";
import ValidatorMixin from "@/services/mixins/ValidatorMixin.js";
import Header from "@/components/Header.vue";
import NewHeader from "@/components/NewHeader.vue";
import AxiosInstance from "@/services/AxiosInstance.js";
import Cookies from "js-cookie";
import router from "@/router.js";

export default {
  components: {NewHeader, Header},
  mixins: [ValidatorMixin],
  data() {
    return {
      email: '',
      password: '',

      passwordError: '',
      emailError: '',
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["loginUser"]),

    sendCredentials() {
      this.emailError = this.validator(this.email, 'required|email|min:5');
      this.passwordError = this.validator(this.password, 'required|min:5');
      if (!this.emailError && !this.passwordError) {
        const userData = {
          'email': this.email,
          'password': this.password,
        }
        this.loginUser(userData);
      }
    },

    github(){
      AxiosInstance.get("/sign-in/github")
          .then((response)=>{
            window.location.href = response.data.url;
          })
          .catch((error)=>{
            console.log(error);
          })
    }
  },

  watch: {
    email(newValue) {
      this.emailError = this.validator(newValue, 'required|email|min:5|max:30');
      useAuthStore().loginError = '';
    },

    password(newValue) {
      this.passwordError = this.validator(newValue, 'required|min:5|max:30');
      useAuthStore().loginError = '';
    },
  },

  computed: {
    authLoginError() {
      return useAuthStore().getLoginError;
    },
  },
};
</script>