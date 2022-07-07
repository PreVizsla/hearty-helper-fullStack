<template>

  <el-container v-loading.fullscreen.lock="fullscreenLoading">

    <el-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Home" name="first">
          <el-main>
            <el-card class="box-card">
              <div slot="header">
                <span><strong>{{username}}</strong></span>
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
                :data="table"
                :default-sort = "{prop: 'sessionId', order: 'descending'}"
                style="width: 100%">

                <el-table-column
                  prop="ID"
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
                  prop="sid"
                  label="Session Token"
                  min-width="180"
                  width="auto">
                </el-table-column>

                <el-table-column
                  prop="active"
                  label="Session State"
                  width="150"
                  fixed="right"
                  sortable>
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.state ? 'danger' : 'success'"
                      disable-transitions>{{scope.row.state ? 'expired' : 'active'}}</el-tag>
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
              <el-form ref="form" :model="dummyCreationForm" label-width="120px">
                <el-form-item label="Patient name">
                  <el-input v-model="patientName"></el-input>
                </el-form-item>

                <el-form-item label="Instant delivery">
                  <el-slider
                    v-model="duration"
                    :min="sessionDurMin"
                    :max="sessionDurMax"
                    :step="sessionDurStep"
                    show-input>
                  </el-slider>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="onSubmit({patientName, duration})">Create</el-button>
                  <el-button>Cancel</el-button>
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
      <p>Session ID: {{currSessionID}}</p>
      <p>Session Token: <strong>{{token}}
          <i class="el-icon-copy-document" @click="copyToken"></i></strong></p>
      <p>The session will end at: {{sessionEndTime}}</p>
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
      token:'',
      hour:'',
      minute:'',
      second:'',
      year:'',
      month:'',
      date:'',
      sessionEndTime:'',
      currSessionID: '',
      fullscreenLoading: false,
      activeName: 'first',
      sessionDurMin: 30,
      sessionDurMax: 600,
      sessionDurStep: 10,
      table:[],
      dummyTableData: [
        {
          sessionId: '000001',
          patientName: 'Antony',
          startTime: '2022-6-30 | 8:40:30',
          duration: '120',
          sessionToken: 'AAAAAA',
          state: 'expired'
        },
        {
          sessionId: '000002',
          patientName: 'Bruce',
          startTime: '2022-6-30 | 8:40:30',
          duration: '120',
          sessionToken: 'BBBBBB',
          state: 'expired'
        },
        {
          sessionId: '000003',
          patientName: 'Charlie',
          startTime: '2022-6-30 | 8:40:30',
          duration: '120',
          sessionToken: 'CCCCCC',
          state: 'expired'
        },
        {
          sessionId: '000004',
          patientName: 'David',
          startTime: '2022-6-30 | 8:40:30',
          duration: '12000',
          sessionToken: 'DDDDDD',
          state: 'active'
        }
      ],
      dummyCreationForm: {
        patientName: '',
        startTime: '',
        duration: 120,
      },
      dialogVisible: false,
      dummyCreationResult:{
        sessionId: '000007',
        sessionToken: 'GGGGGG',
        sessionEndTime: '2022-7-1 | 0:30:30',
      }
    };
  },
  computed:{

    patientName:{
      get() {
        return this.$store.state.session.patientName;
      },
      set(value) {
        this.$store.commit("session/setpatientName", value);
      },
    },
    duration:{
      get() {
        return this.$store.state.session.duration;
      },
      set(value) {
        this.$store.commit("session/setduration", value);
      },
    },
    sid:{
      get() {
        return this.$store.state.session.sid;
      },
      set(value) {
        this.$store.commit("session/setsid", value);
      },
    }
  },
  methods: {
    async logout(){
      console.log('logout');
      // TODO (done))
      // Method only for vanilla js
      // var cookies = document.cookie.split(';');
      // for (var i=0; i<cookies.length; i++){
      //   var cookie = cookies[i];
      //   var eqPos = cookie.indexOf("=");
      //   var name = eqPos > -1 ? cookie.substr(0,eqPos):cookie;
      //   document.cookie = name +"=;expires=Thi, 01 Jan 1970 00:00:00 GMT";
      // }
      // localStorage.clear();
      await this.$auth.logout();
      this.$router.push('login');
    },

    async displayName(){
      this.username = JSON.parse(localStorage.getItem("profile")).data.name;
      // console.log(this.username);
      // console.log("WAAAAAAAAAAAAAAA "+ this.username)
      const link = "http://localhost:5000/session/list/:"+this.username.replace(/\s/g, '');
      console.log(link);
      // await this.$axios.get("http://localhost:5000/session/list");
      
      await this.$axios.get(link)
      .then((response)=>{
        console.log(response.data);
        this.table = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },

    async onSubmit(session) {
      console.log('submit, if the session is successfully created, server will return the Session ID + Session Token');
      // console.log(this.dummyCreationForm);
      // console.log(Math.floor(Math.random() * Date.now()))
      // TODO set the creation time as NOW
      // TODO (done) send the the request with details to the server
      // TODO (done) if the request is accepted, show the dialog with session IDs and Tokens
      // TODO (done) fullscreen loading when sending/fetching data from backend
      const currentdate = new Date();
      console.log(currentdate);
      //method to get date
      const hour = Math.floor(session.duration/3600);
      const minute =  Math.floor((session.duration-hour*3600)/60);
      const second =  Math.floor((session.duration-hour*3600-minute*60));
      this.hour = currentdate.getHours() + hour
      this.minute = currentdate.getMinutes() + minute
      this.second= currentdate.getSeconds() + second
      this.date = currentdate.getDate()
      this.month = currentdate.getMonth()+1
      this.year = currentdate.getFullYear()
      this.sessionEndTime = this.year+'-'+this.month+'-'+this.date+' | '+this.hour+':'+this.minute+':'+this.second

      // token generation is based on the milisecond the user create the session * random numbers
      // probability that 2 event happened in a milisecond is one in
      const dt = currentdate;
      dt.setSeconds(dt.getSeconds()+this.duration)
      this.token = Math.floor(Math.random() * Date.now()).toString();
      console.log(this.duration);
      console.log(dt);
      const shortened = this.username.replace(/\s/g, '');
      await this.$axios.post("http://localhost:5000/session/create", {
          creator: shortened,
          start: new Date(),
          end: dt,
          patientName: session.patientName,
          duration: session.duration,
          sid: this.token,
        });

      // getting latest ID
      await this.$axios.get("http://localhost:5000/session/count")
      .then((response)=>{
        console.log("count : " + response.data);
        this.currSessionID = response.data + 1;
      })
      .catch((error) => {
        console.log(error);
      })
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.dialogVisible = true;
      }, 1000);
      
      //step to get the real time sessionID
      
      //update table value
      const link = "http://localhost:5000/session/list/:"+this.username.replace(/\s/g, '');
      
      await this.$axios.get(link)
      .then((response)=>{
        console.log(response.data);
        this.table = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      
      const len = this.table.length;
      console.log("table len ", this.table[len-1]);
      this.table[len-1].ID = this.currSessionID;
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
        
    },
    copyToken() {
      navigator.clipboard.writeText(this.token);
      console.log('the token is copied.');
      this.$notify({
        title: 'Success',
        message: 'Token is copied to clipboard.',
        type: 'success'
      });
    }
  },
  mounted(){
    // this.username = JSON.parse(localStorage.getItem("profile")).data.name;
    // console.log("OI");
    // console.log(JSON.parse(localStorage.getItem("profile")));
    this.displayName();
    
    // axios.get('http://localhost:5000/session/list/:')
  },
}
</script>

<style scoped>

</style>
