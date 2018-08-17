<template>
  <v-navigation-drawer app
  :clipped="$vuetify.breakpoint.lgAndUp"
    v-model="drawer"
      fixed>
 <v-tabs id="tab-request">
      <v-tab ripple >Histroy</v-tab>
      <v-tab ripple>Collections</v-tab>
      <v-tab-item>
        <v-list>
          <v-list-tile
            v-for="(histroy,index) in histories"
            :key="index"
            @click="setCurrentRequest(histroy)"
          >
              <v-list-tile-avatar class="uppercase body-1">
                {{histroy.method}}
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title>{{ histroy.url }}</v-list-tile-sub-title>
            </v-list-tile-content>
            </v-list-tile>
        </v-list>
      </v-tab-item>
      <v-tab-item>
          <v-list>
          <v-list-group
            v-for="(device,index) in devices"
            v-model="device.active"
            :key="index"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ device.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
            class="sub-item"
              v-for="(request,index) in device.requests"
              :key="index"
              @click="setCurrentRequest(request.request)"
            >
               <v-list-tile-avatar class="uppercase body-1">
                {{request.request.method}}
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ request.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ request.request.url }}</v-list-tile-sub-title>
            </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-tab-item>
 </v-tabs>
  </v-navigation-drawer>
</template>
<script>
import EventBus from "../event-bus";
import { CoapRequest } from "../classes";
import mockdata from "../mockdata";
export default {
  data() {
    return {
      histories: mockdata.histories,
      devices: mockdata.devices,
      setCurrentRequest: function(request) {
        EventBus.$emit("setCurrentRequest", request);
      }
    };
  },
  props: {
    drawer: Boolean
  }
};
</script>
<style scoped>
.sub-item > :nth-child(1){
  padding-left: 24px;
}
</style>
