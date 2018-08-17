<template>
  <div>
    <v-container>
      <v-layout row wrap>
         <v-flex md1 xs12>
            <v-select class="uppercase" :items="methods" v-model="currentRequest.method"></v-select>
         </v-flex>
         <v-flex md10 xs12>
            <v-text-field id="url" v-model="currentRequest.url" placeholder="Url"></v-text-field>
         </v-flex>
         <v-flex md1 xs12>
            <v-btn @click="send()" id="send" color="info">Send</v-btn>
         </v-flex>
      </v-layout>
    
    <v-layout row wrap>
      <v-flex xs12>

    <v-tabs id="tab-request" color="grey lighten-2">
      <v-tab ripple class="tab-bar">Header</v-tab>
      <v-tab ripple class="tab-bar">Body</v-tab>
      <v-tab-item id="tab-heads">
            <v-layout row id="requesy-heads" class="table-head" align-center>
            <v-flex xs5 pa-2 font-weight-medium>Key</v-flex>
            <v-flex xs5 pa-2 font-weight-medium>Value</v-flex>
            <v-flex xs2 >
              <v-btn flat  @click="addHeader()">
              <i class="material-icons btn-add">add</i> 
              Add Item
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout justify-center align-center row wrap xs5 v-for="(header,index) in currentRequest.headerArray" :key="index" class="head-row">
            <v-flex xs5 pr-4>
                  <v-text-field type="text" v-model="header.key"/>
            </v-flex>
            <v-flex xs5 pr-4>
              <v-text-field type="text" v-model="header.value"/>
            </v-flex>
            <v-flex xs2 pl-4 >
                <i class="material-icons btn-close" @click="removeHead(header)">close</i>
            </v-flex>
              
          </v-layout>
        
      </v-tab-item>
      <v-tab-item class="mdl-tabs__panel" id="tab-body">
          <v-textarea type="text" rows="5" id="request-body" placeholder="Request Body" box
          v-model="currentRequest.body" :disabled="currentRequest.method=='get'">
          </v-textarea>
      </v-tab-item>
    </v-tabs>
    </v-flex>
    </v-layout>

    <v-progress-linear id="loading"  v-bind:class="{loading:isLoading}"  :indeterminate="true"></v-progress-linear>
    <v-layout grey lighten-2  pa-3>
    <v-flex font-weight-medium >RESPONSE</v-flex>
    <v-flex xs4 text-xs-right  red--text v-bind:class="{'green--text':currentResponse && isStatusNomal(currentResponse.code)}" class="status" v-if="currentResponse && currentResponse.code">status: {{currentResponse.code}}</v-flex>

    </v-layout>
      <v-textarea type="text" box
      rows="10" id="response-body" v-model="currentResponse.payload"
        placeholder="Hit the Send button to get a response.">
      </v-textarea>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
    >
      {{ snackbar_msg }}
    </v-snackbar>

    </v-container>
  </div>
</template>
<script>
import isElectron from "is-electron";
import EventBus from "../event-bus";
import { CoapRequest } from "../classes";
function getHeadersObj(headerArray) {
  if (!headerArray) {
    return null;
  }
  let obj = {};
  headerArray.forEach(header => {
    if (header.key && header.value) {
      obj[header.key] = header.value;
    }
  });
  return obj;
}

function generateArgs(request) {
  console.log(request);
  return {
    method: request.method,
    url: request.url,
    body: request.body,
    headers: getHeadersObj(request.headerArray)
  };
}
function sendHttp(vue, request) {
  vue.$http
    .post("http://localhost:3000/coap/request", request, {
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      // use before callback
      before(request) {
        vue.isLoading = true;
        if (this.previousRequest) {
          console.log("abort");
          // this.previousRequest.abort();
        }

        // set previous request on Vue instance
        this.previousRequest = request;
      }
    })
    .then(
      response => {
        console.log(response);
        vue.isLoading = false;
        vue.currentResponse = response.body;
      },
      response => {
        console.log(response);
        vue.snackbar = true;
        vue.snackbar_msg = "Fetch Failed: " + response.status;
        vue.isLoading = false;
      }
    );
}
let sendCoap = function(vue, request) {
  const { ipcRenderer } = require("electron");

  ipcRenderer.send("icpRequest", request);
  ipcRenderer.on("icpResponse", (event, arg) => {
    console.log(arg);
    vue.currentResponse = arg;
  });
};

export default {
  data: function() {
    return {
      methods: ["get", "post", "put", "delete"],
      currentRequest: new CoapRequest(),
      currentResponse: {},
      isLoading: false,
      snackbar: false,
      snackbar_msg: ""
    };
  },
  created() {
    EventBus.$on("setCurrentRequest", request => {
      this.currentRequest = request;
    });
  },
  methods: {
    isStatusNomal: function(value) {
      try {
        if (value && Math.floor(value) == 2) {
          return true;
        }
      } catch (e) {
        return false;
      }
    },

    removeHead: function(header) {
      let index = this.currentRequest.headerArray.indexOf(header);
      this.currentRequest.headerArray.splice(index, 1);
    },
    addHeader: function() {
      if (!this.currentRequest.headerArray)
        this.currentRequest.headerArray = [];
      this.currentRequest.headerArray.push({});
    },
    send: function() {
      let request = generateArgs(this.currentRequest);
      console.log(JSON.stringify(request));
      this.currentResponse = {};
      if (
        !this.currentRequest.url.startsWith("coap://") &&
        !this.currentRequest.url.startsWith("coaps://")
      ) {
        this.snackbar = true;
        this.snackbar_msg = "Url Illegal!";
        return;
      }
      if (isElectron()) {
        sendCoap(this, request);
      } else {
        sendHttp(this, request);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../static/index.css";
</style>

<style>
.v-select-list * {
  text-transform: uppercase;
}
</style>
