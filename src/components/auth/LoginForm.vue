<template>
  <form class="login-form" @submit.stop.prevent="submit">
    <p v-if="errorText" class="login-form__error">{{ errorText }}</p>
    <label class="login-form__label">
      Email
      <input
        placeholder="Here should be your email"
        type="email"
        name="graph-app-email"
        class="login-form__field"
        v-model="email"
        autocomplete="false"
      />
    </label>
    <label class="login-form__label">
      Password
      <input
        placeholder="Here should be your password"
        type="password"
        name="graph-app-password"
        class="login-form__field"
        v-model="password"
        autocomplete="new-password"
      />
    </label>
    <button class="g-button login-form__submit">Authenticate yourself!</button>
  </form>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
    },
  },
  data() {
    return {
      email: "",
      password: "",
      innerError: "",
    };
  },
  computed: {
    errorText() {
      return this.innerError || this.error;
    },
  },
  methods: {
    submit() {
      this.innerError = "";
      const { email, password } = this;
      if (!email || !password) {
        this.innerError = "Please enter Email and Password";
        return;
      }
      this.$emit("authenticate", { email, password });
    },
  },
};
</script>

<style scoped>
.login-form {
  display: block;
  padding: 16px;
  width: 100%;
  max-width: 360px;
  border-radius: 5px;
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.15);
}
.login-form__error {
  padding-bottom: 8px;
  color: orange;
}
.login-form__label {
  display: block;
  margin-bottom: 16px;
  font-size: 10px;
}
.login-form__field {
  display: block;
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding: 0 8px;
}
.login-form__submit {
  display: block;
  width: 100%;
}
.login-form__field:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px #63b1bc;
}
</style>
