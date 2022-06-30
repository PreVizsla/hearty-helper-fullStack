<template>
  <div>
    <div>
      <h1>yo</h1>
      <div>
    <!-- font awesome icon not working -->
    <font-awesome-icon :icon="['fas', 'user-secret']" />

    <NuxtWelcome />
  </div>
    </div>
  <div class="login">
    <el-card>
      <h2>Login</h2>
      <el-form
        class="login-form"
        :model="model"
        :rules="rules"
        ref="form"
      >
        <!-- prefix icon not working, followed this guideline -->
        <!-- https://fontawesome.com/docs/web/use-with/vue/use-with -->
        <!-- added fontawesome plugins too -->
        <el-form-item prop="username">
          <el-input v-model="model.username" placeholder="Username" 
          prefix-icon="fas fa-user">
            <i class="fas fa-user fa-lg"></i> 
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="model.password"
            placeholder="Password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            @click="onSubmit"
            block
          >Login</el-button>
        </el-form-item>
        <!-- just a dummy link -->
        <a class="forgot-password" href="https://oxfordinformatics.com/">Forgot password ?</a>

      </el-form>
    </el-card>
  </div>

  </div>

</template>

<script>

export default {
  name: "login",

  data() {
    return {
      validCredentials: {
        username: "lightscope",
        password: "lightscope"
      },
      model: {
        username: "",
        password: ""
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "Username is required",
            trigger: "blur"
          },
          {
            min: 4,
            message: "Username length should be at least 5 characters",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "Password is required", trigger: "blur" },
          {
            min: 5,
            message: "Password length should be at least 5 characters",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit(){
      console.log("yoo");
    },
    
    simulateLogin() {
      return new Promise(resolve => {
        setTimeout(resolve, 800);
      });
    },

    async login() {
      console.log("yoi");
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;
      await this.simulateLogin();
      this.loading = false;
      if (
        this.model.username === this.validCredentials.username &&
        this.model.password === this.validCredentials.password
      ) {
        this.$message.success("Login successfull");
      } else {
        this.$message.error("Username or password is invalid");
      }
    }
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
