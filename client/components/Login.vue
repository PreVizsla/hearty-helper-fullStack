<template>
  <div>
    <div class="login">
    <el-card>
      <h2>Sign Up</h2>
      <el-form
        class="login-form"
        ref="form"
      >
        <!-- prefix icon not working, followed this guideline -->
        <!-- https://fontawesome.com/docs/web/use-with/vue/use-with -->
        <!-- added fontawesome plugins too -->
        <el-form-item prop="firstName">
          <el-input v-model="firstName" placeholder="First Name"
          prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>

        <el-form-item prop="lastname">
          <el-input
            v-model="lastname"
            placeholder="Last Name"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="email"
            placeholder="email"
            type="email"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="password"
            placeholder="Password"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="confirmPassword"
            placeholder="Password Confirmation"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            class="login-button"
            type="primary"
            @click="onSubmit({ firstName, lastname, email, password, confirmPassword })"
            block
          >Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  </div>

</template>

<script>

export default {
  name: "login",

  computed: {
    firstName: {
      get() {
        return this.$store.state.user.firstName;
      },
      set(value) {
        this.$store.commit("user/setfirstName", value);
      },
    },
    lastname: {
      get() {
        return this.$store.state.user.lastname;
      },
      set(value) {
        this.$store.commit("user/setlastName", value);
      },
    },
    email: {
      get() {
        return this.$store.state.user.email;
      },
      set(value) {
        this.$store.commit("user/setEmail", value);
      },
    },
    password: {
      get() {
        return this.$store.state.user.password;
      },
      set(value) {
        this.$store.commit("user/setPassword", value);
      },
    },
    confirmPassword: {
      get() {
        return this.$store.state.user.confirmPassword;
      },
      set(value) {
        this.$store.commit("user/setconfirmPassword", value);
      },
    },    
  },
  methods: {
    async onSubmit(user){
      console.log(user);
      console.log(user.firstName);
      await this.$axios.post("http://localhost:5000/user/signup", {
          firstName: user.firstName,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          confirmPassword: user.confirmPassword,
        });
      
    },
    // resetUser(user) {
    //   this.$store.commit("user/setId", user.id);
    //   this.$store.commit("user/setName", user.name);
    //   this.$store.commit("user/setEmail", user.email);
    //   this.$store.commit("user/setPassword", user.password);
    // },
  }

    
};
</script>

<style scoped>
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  margin-top: 40px;
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
}

.el-button--primary {
  background: rgb(0, 124, 137);
  border-color: rgb(0, 124, 137);

}
.login .el-input__inner:hover {
  border-color: rgb(0, 124, 137);
}
.login .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;

}
.login .el-input input {
  padding-left: 35px;
}
.login .el-card {
  padding-top: 0;
  padding-bottom: 30px;
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
a {
  color: rgb(0, 124, 137);
  text-decoration: none;

}
.login .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>
