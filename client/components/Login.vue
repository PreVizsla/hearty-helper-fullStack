<template>
  <el-container style="height: 100vh">
    <div class="login">
    <el-card>
      <h2 v-if="isSignup" style="text-align: center">SIGN UP</h2>
      <h2 v-else style="text-align: center">LOG IN</h2>
      
      <el-form
        :model = "ruleForm"
        :rules = "rules"
        ref = "ruleForm"
        class="login-form"
      >
      
        <!-- rules prop doesnt work with v-if -->
        <div>
          <el-form-item prop="firstName" v-if="isSignup">
            <el-input v-model= "ruleForm.firstName" placeholder="First Name"
            prefix-icon="el-icon-user">
            </el-input>
          </el-form-item>
        </div>

        <div>
          <!-- lastname prop only works if firstname has div -->
          <el-form-item  prop="lastName" v-if="isSignup" >
            <el-input
              v-model= "ruleForm.lastName"
              placeholder="Last Name"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
        </div>

        <div>
        <el-form-item prop="email">
          <el-input
            v-model = "ruleForm.email"
            placeholder="email"
            type="email"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        </div>

        <div>
        <el-form-item prop="password">
          <el-input
            v-model= "ruleForm.password"
            placeholder="Password"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        </div>

        <div>
        <el-form-item v-if="isSignup" prop="confirmPassword">
          <el-input
            v-model= "ruleForm.confirmPassword"
            placeholder="Password Confirmation"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        </div>

        <el-form-item class="placeholder"></el-form-item>

        <!-- for sign up button -->
        <el-form-item v-if="isSignup">
          <el-button
            class="login-button"
            type="primary"
            @click="onSubmit('ruleForm')"
            block
          >Sign Up</el-button>
        </el-form-item>

        <!-- for login button -->
        <el-form-item v-else>
          <el-button
            class="login-button"
            type="primary"
            @click="onSubmitLogIn('ruleForm')"
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
    var validateConfirmPwd = (rule, value, callback) => {
        if (this.ruleForm.password !== value) {
            callback (new Error ('the confirmation password is inconsistent with the new password!' ))
        } else {
            callback()
        }
    }
    return{
      success: false,
      error:false,
      ruleForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
      },
      isSignup: false,
      rules: {
        firstName: [
          {required:true, message: 'Please input first name', trigger: 'blur'},
          {min:1, message:'First name should be at least 1 character long', trigger: 'blur'}
        ],lastName: [
          {required:false, message: 'Please input last name', trigger: 'blur'}
        ],email: [
          {required:true, message: 'Please input email', trigger: 'blur'},
          {type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
        ],password: [
          {required:true, message: 'Please input password', trigger: 'blur'},
          {min:6, message:'Password should be at least 6 characters long', trigger: 'blur'}
        ],confirmPassword:[
          {required:true, message: 'Please re-input password', trigger: 'blur'},
          {validator: validateConfirmPwd, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    setIsSignup(){
      this.isSignup = !this.isSignup
    },

    // signup
    async onSubmit(user){
      this.$refs[user].validate((valid) => {
        if (valid) {
          this.success = true;
        } else {
          console.log('error submit!!');
          this.success = false;
        }
      });
      console.log(this.success);
      if(this.success){
        console.log("success 1");
        await this.$axios.post("https://hhelper-server.herokuapp.com/user/signup", {
        // await this.$axios.post("http://localhost:5000/user/signup", {
            firstName: this.ruleForm.firstName,
            lastName: this.ruleForm.lastName,
            email: this.ruleForm.email.toLowerCase(),
            password: this.ruleForm.password,
            confirmPassword: this.ruleForm.confirmPassword,
          }).then(res => {
            if(res.data.error === 400){
              alert('User already exists');
              this.error = true;
            }else if(res.data.error === 403){
              alert('Password doesn\'t match');
              this.error = true;
            }else{
              this.error = false;
            }
          });

        //if there are no error
        if(!this.error){
          await this.$auth.loginWith('local',{
              data:this.ruleForm
          })

          const acc = await this.$axios.post("https://hhelper-server.herokuapp.com/user/user",
          // const acc = await this.$axios.post("http://localhost:5000/user/user",
          {
            firstName: this.ruleForm.firstName,
            lastName: this.ruleForm.lastName,
            email: this.ruleForm.email.toLowerCase(),
            password: this.ruleForm.password,
            confirmPassword: this.ruleForm.confirmPassword,
          })
          localStorage.setItem('profile', JSON.stringify(acc));
          this.$router.push('/dashboard')
        }
      }
    },

    // login
    async onSubmitLogIn(user){
      this.$refs[user].validate((valid) => {
        if (valid) {
          this.success = true;
        } else {
          console.log('error submit!!');
          this.success = false;
        }
      });

      if(this.success){
        await this.$axios.post("https://hhelper-server.herokuapp.com/user/signin", {
        // await this.$axios.post("http://localhost:5000/user/signin", {
            firstName:this.ruleForm.firstName,
            lastName: this.ruleForm.lastName,
            email: this.ruleForm.email.toLowerCase(),
            password: this.ruleForm.password,
            confirmPassword: this.ruleForm.confirmPassword,
          }).then(res => {
            console.log("status "+res.status);
            console.log("error: "+res.error);
            console.log("msg: "+res.json);
            console.log("data: "+res.data.error);
            if(res.data.error === 404){
              alert('User doesn\'t exist');
            }else if (res.data.error === 403){
              alert('Invalid Credentials');
            }else{
              this.error = false;
            }
        })
        //if there are no error
        if(!this.error){
        // console.log("tes " + res);
        // console.log("status "+ res.status);
          // causing error to stop async function
            await this.$auth.loginWith('local',{
            data: this.ruleForm
            });
            const acc = await this.$axios.post("https://hhelper-server.herokuapp.com/user/user",
            // const acc = await this.$axios.post("http://localhost:5000/user/user",
            {
              firstName: this.ruleForm.firstName,
              lastName: this.ruleForm.lastName,
              email: this.ruleForm.email.toLowerCase(),
              password: this.ruleForm.password,
              confirmPassword: this.ruleForm.confirmPassword,
            })
            // localStorage.setItem('profile', JSON.stringify({acc}));
            localStorage.setItem('profile', JSON.stringify(acc));
            this.$router.push('/dashboard')
        }
      }
      
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
