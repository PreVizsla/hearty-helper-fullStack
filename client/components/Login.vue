<template>
  <el-container style="height: 100vh">
    <div class="login">
    <el-card>
      <h2 v-if="isSignup" style="text-align: center">SIGN UP</h2>
      <h2 v-else style="text-align: center">LOG IN</h2>
      <el-form
        class="login-form"
        ref="form"
      >
        <!-- prefix icon not working, followed this guideline -->
        <!-- https://fontawesome.com/docs/web/use-with/vue/use-with -->
        <!-- added fontawesome plugins too -->


        <el-form-item v-if="isSignup" prop="firstName">
          <el-input v-model="firstName" placeholder="First Name"
          prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>

        <el-form-item v-if="isSignup" prop="lastName">
          <el-input
            v-model="lastName"
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

        <el-form-item v-if="isSignup" prop="confirmPassword">
          <el-input
            v-model="confirmPassword"
            placeholder="Password Confirmation"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item class="placeholder"></el-form-item>

        <!-- for sign up button -->
        <el-form-item v-if="isSignup">
          <el-button
            class="login-button"
            type="primary"
            @click="onSubmit({ firstName, lastName, email, password, confirmPassword })"
            block
          >Sign Up</el-button>
        </el-form-item>

        <!-- for login button -->
        <el-form-item v-else>
          <el-button
            class="login-button"
            type="primary"
            @click="onSubmitLogIn({ firstName, lastName, email, password, confirmPassword })"
            block
          >Login</el-button>
        </el-form-item>

        <el-form-item v-if="isSignup">
          <el-button class="login-button" type="primary" @click="setIsSignup">
            Already have an account? Sign In
          </el-button>
        </el-form-item>

        <el-form-item v-else>
          <el-button class="login-button" type="primary" @click="setIsSignup">
            Don't have an account? Sign Up
          </el-button>
        </el-form-item>


      </el-form>

      <!-- switching button -->
<!--      <el-button v-if="isSignup"-->
<!--      type="success"-->
<!--      @click="setIsSignup">-->
<!--        Already have an account? Sign In-->
<!--      </el-button>-->

<!--      <el-button v-else-->
<!--      type="success"-->
<!--      @click="setIsSignup">-->
<!--        Don't have an account? Sign Up-->
<!--      </el-button>-->
    </el-card>
  </div>

    <el-footer style="position: fixed; bottom: 0; width: 100%; height: 20px; line-height: 20px; z-index: 999; text-align: center; font-size: small; box-shadow: 0px -2px 8px #D0D3D4">
      Copyright &#169 Ho Lab, HKU
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "login",
  data(){
    return{
      isSignup: false
    }
  },
  computed: {
    firstName: {
      get() {
        return this.$store.state.user.firstName;
      },
      set(value) {
        this.$store.commit("user/setfirstName", value);
      },
    },
    lastName: {
      get() {
        return this.$store.state.user.lastName;
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
    name: {
      get() {
        return this.$store.state.user.name;
      },
      set(value) {
        this.$store.commit("user/setname", value);
      },
    },
  },
  methods: {
    setIsSignup(){
      this.isSignup = !this.isSignup
    },
    async onSubmit(user){
      console.log(user);
      console.log(user.firstName);
      await this.$axios.post("https://hhelper-server.herokuapp.com/user/signup", {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          confirmPassword: user.confirmPassword,
        });
      await this.$auth.loginWith('local',{
          data:user
      })
      const acc = await this.$axios.post("https://hhelper-server.herokuapp.com/user/user",
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
      })
      localStorage.setItem('profile', JSON.stringify(acc));
      this.$router.push('/dashboard')
    },

    async onSubmitLogIn(user){
      await this.$axios.post("https://hhelper-server.herokuapp.com/user/signin", {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          confirmPassword: user.confirmPassword,
        });
      await this.$auth.loginWith('local',{
        data: user
      });
      const acc = await this.$axios.post("https://hhelper-server.herokuapp.com/user/user",
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
      })
      // localStorage.setItem('profile', JSON.stringify({acc}));
      localStorage.setItem('profile', JSON.stringify(acc));
      this.$router.push('/dashboard')
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
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
}

/*.el-button--primary {*/
/*  background: rgb(0, 124, 137);*/
/*  border-color: rgb(0, 124, 137);*/

/*}*/
/*.login .el-input__inner:hover {*/
/*  border-color: rgb(0, 124, 137);*/
/*}*/
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
