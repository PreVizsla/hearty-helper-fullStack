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
                Some user information perhaps or a greeting.
              </p>
            </el-card>
          </el-main>
        </el-tab-pane>

        <el-tab-pane label="History" name="second">
          <el-main>
            <el-card class="box-card">
              <el-table
                :data="dummyTableData"
                :default-sort = "{prop: 'sessionId', order: 'descending'}"
                style="width: 100%">
                <el-table-column
                  prop="sessionId"
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
                  prop="sessionToken"
                  label="Session Token"
                  min-width="180"
                  width="auto">
                </el-table-column>
                <el-table-column
                  prop="state"
                  label="Session State"
                  width="150"
                  fixed="right"
                  sortable>
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.state === 'expired' ? 'danger' : 'success'"
                      disable-transitions>{{scope.row.state}}</el-tag>
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
              <el-form ref="form" :model="dummyCreationForm" label-width="120px">
                <el-form-item label="Patient name">
                  <el-input v-model="dummyCreationForm.patientName"></el-input>
                </el-form-item>
                <el-form-item label="Instant delivery">
                  <el-slider
                    v-model="dummyCreationForm.duration"
                    :min="sessionDurMin"
                    :max="sessionDurMax"
                    :step="sessionDurStep"
                    show-input>
                  </el-slider>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">Create</el-button>
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
      <p>Session ID: {{dummyCreationResult.sessionId}}</p>
      <p>Session Token: <strong>{{dummyCreationResult.sessionToken}}
          <i class="el-icon-copy-document" @click="copyToken"></i></strong></p>
      <p>The session will end at: {{dummyCreationResult.sessionEndTime}}</p>
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
      fullscreenLoading: false,
      username: 'a',
      activeName: 'first',
      sessionDurMin: 30,
      sessionDurMax: 600,
      sessionDurStep: 10,
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
  mounted(){
    const username = JSON.parse(localStorage.getItem("profile")).data.name;
    console.log(username);
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onSubmit() {
      console.log('submit, if the session is successfully created, server will return the Session ID + Session Token');
      console.log(this.dummyCreationForm);
      // TODO set the creation time as NOW
      // TODO send the the request with details to the server
      // TODO if the request is accepted, show the dialog with session IDs and Tokens
      // TODO fullscreen loading when sending/fetching data from beckend

      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.dialogVisible = true;
      }, 1000);
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    copyToken() {
      // TODO copy the token to the clipboard
      console.log('the token is copied.');
      this.$notify({
        title: 'Success',
        message: 'Token is copied to clipboard.',
        type: 'success'
      });
    }
  },
}
</script>

<style scoped>

</style>
