<template>
  <div class="login-page">
    <LoginForm :error="authError" @authenticate="authenticate" />
  </div>
</template>

<script>
import { authenticate } from "@/utils/authUtil";
import LoginForm from "@/components/auth/LoginForm";

export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      authError: "",
    };
  },
  methods: {
    authenticate(creds) {
      this.authError = "";
      const result = authenticate(creds);
      if (result.error) {
        this.authError = result.error;
      } else {
        this.$router.push({ name: "GraphPage" });
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
</style>
