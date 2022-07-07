<template>

  <el-container v-loading.fullscreen.lock="fullscreenLoading">

    <el-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Home" name="first">
          <el-main>
            <el-card class="box-card">
              <div slot="header">
                <span><strong>Hi, {{username}}</strong></span>
              </div>
              <p>
                Welcome to the dashboard!
              </p>
              <el-row type="flex" justify="end">
                <el-button type="warning" @click="logout">Logout</el-button>
              </el-row>
            </el-card>
          </el-main>
        </el-tab-pane>

        <el-tab-pane label="History" name="second">
          <el-main>
            <el-card class="box-card">
              <el-table
                :data="historyData"
                :default-sort = "{prop: 'sessionId', order: 'descending'}"
                style="width: 100%">
                <el-table-column
                  prop="_id"
                  label="Session ID"
                  sortable
                  fixed
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="patientName"
                  label="Patient Name"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="startTime"
                  label="Session Start Time"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="duration"
                  label="Session Duration"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="token"
                  label="Session Token"
                  min-width="180"
                  width="auto">
                </el-table-column>
                <el-table-column
                  prop="active"
                  label="State"
                  width="150"
                  fixed="right"
                  sortable>
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.active === true ? 'success' : 'danger'"
                      disable-transitions>{{scope.row.active === true ? 'Active' : 'Expired'}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <div style="width: 100%; height: 20px"></div>
          </el-main>
        </el-tab-pane>

        <el-tab-pane label="Create Session" name="third">
          <el-main>
            <el-card class="box-card">

              <!-- submission form -->
              <el-form :model="sessionForm" :rules="formRules" ref="sessionForm" label-width="120px">
                <el-form-item label="Patient name" prop="patientName">
                  <el-input v-model="sessionForm.patientName"></el-input>
                </el-form-item>

                <el-form-item label="Duration">
                  <el-slider
                    v-model="sessionForm.duration"
                    :min="sessionDurMin"
                    :max="sessionDurMax"
                    :step="sessionDurStep"
                    show-input>
                  </el-slider>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm('sessionForm')">Create</el-button>
                </el-form-item>
              </el-form>

            </el-card>
          </el-main>
        </el-tab-pane>

        <el-tab-pane label="Setting" name="fourth">
          <el-main>
            <el-card class="box-card">
              <p>
                TODO: Setting page, or providing some instructions.
              </p>
            </el-card>
          </el-main>
        </el-tab-pane>

      </el-tabs>
    </el-header>

    <el-dialog
      title="Session creation result"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <p>The session is successfully created.</p>
      <p>Session ID: {{ creationResult.sessionId }}</p>
      <p>Session Token: <strong>{{creationResult.sessionToken}}
          <i class="el-icon-copy-document" @click="copyToken"></i></strong></p>
      <p>The session will end at: {{creationResult.sessionEndTime}}</p>
      <p>The session can be found in the History.</p>
      <!--TODO: Automatically generate QRcode which contains the app domain + the token for easy access-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <el-footer style="position: fixed; bottom: 0; width: 100%; height: 20px; line-height: 20px; z-index: 999; text-align: center; font-size: small; box-shadow: 0px -2px 8px #D0D3D4">
      Copyright &#169 Ho Lab, HKU
    </el-footer>

  </el-container>

</template>

<script>
export default {

  name: "dashboard",
  data() {
    return {
      username: '',
      hiddenId: '',
      fullscreenLoading: false,
      activeName: 'first',
      sessionDurMin: 30,
      sessionDurMax: 600,
      sessionDurStep: 10,
      historyData: [],
      sessionForm: {
        patientName: '',
        duration: 120,
      },
      formRules: {
        patientName: [
          {required: true, message: 'Please input patient name', trigger: 'change'},
        ],
      },
      dialogVisible: false,
      creationResult:{
        sessionId: '',
        sessionToken: '',
        sessionEndTime: '',
      }
    };
  },
  computed:{

  },
  methods: {
    async logout(){
      console.log('logout');
      await this.$axios.post("http://localhost:5000/user/logout", {
        _id: this.hiddenId,
      })
      localStorage.removeItem('token');
      await this.$router.push('/');
    },
    displayName(){
      console.log(JSON.parse(localStorage.getItem("profile")))
      this.username = JSON.parse(localStorage.getItem("profile")).data.name;
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.paneName === 'second') {
        console.log('pull history');
        this.pullHistory();
      }
    },
    submitForm(formName) {
      console.log('submit, if the session is successfully created, server will return the Session ID + Session Token');
      // console.log(this.dummyCreationForm);
      // console.log(Math.floor(Math.random() * Date.now()))
      // TODO set the creation time as NOW
      // TODO send the the request with details to the server
      // TODO if the request is accepted, show the dialog with session IDs and Tokens
      // TODO fullscreen loading when sending/fetching data from backend

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          this.creatSession();
        } else {
          console.log('error submit!!');
          return false;
        }
      })

    },

    async creatSession() {
      const currentDate = new Date();
      const startTimestamp = currentDate.getTime();
      const duration = this.sessionForm.duration;
      const endTimestamp = startTimestamp + this.sessionForm.duration * 1000
      const creator = this.hiddenId;
      const patientName = this.sessionForm.patientName;
      await this.$axios.post("http://localhost:5000/session/create", {
            creator: creator,
            patientName: patientName,
            startTime: startTimestamp,
            endTime: endTimestamp,
            duration: duration
      }).then(res => {
        console.log(res);
        if (res.status === 200) {
          // update modal content
          this.creationResult.sessionId = res.data.result._id;
          this.creationResult.sessionEndTime = res.data.result.endTime;
          this.creationResult.sessionToken = res.data.result.token;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.dialogVisible = true;
          }, 100);
        }
      })
    },

    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    copyToken() {
      navigator.clipboard.writeText(this.creationResult.sessionToken);
      console.log('the token is copied.');
      this.$notify({
        title: 'Success',
        message: 'Token is copied to clipboard.',
        type: 'success'
      });
    },
    async pullHistory(){

      await this.$axios.post("http://localhost:5000/session/getSessionByCreator", {
        creator: this.hiddenId,
      }).then(res => {
        if (res.status === 200) {
          this.historyData = res.data;
          // check the session state in front-end
          this.historyData.forEach(record => {
            record['active'] = (new Date(record.endTime) > new Date());
            record['startTime'] = String(new Date(record.startTime));
          })
        }
      })
    },
  },



  mounted(){
    this.hiddenId = JSON.parse(localStorage.getItem("profile")).data._id;
    console.log(this.hiddenId);
    this.displayName();
    this.pullHistory();
  },
}
</script>

<style scoped>

</style>
