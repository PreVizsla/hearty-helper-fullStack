<!-- Please remove this file from your project -->
<template>
<div class="container">
  <div class="card">
    <b-form-group
          id="fieldset-1"
          label="Email address"
          >
          <b-form-input id="input-1"> </b-form-input>
    </b-form-group>
    <form>
      <h1>Sign In</h1>
        
        <div class="form-group row">
          <label>Password</label>
          <input type="password" class="form-control form-control-lg" />
        </div>
 
        <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>
    </form>
  </div>
</div>
</template>

<script>
export default {
  name: 'NuxtTutorial',

  data(){
    return {
      isSignUp: false,
    }
  },
  methods:{

  },
}
</script>

<style>
  .container {
    width: 100%;
  }
  .card{
    box-shadow:  0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    width: 50%;
    margin:auto;
    text-align: center;

  }
</style>
