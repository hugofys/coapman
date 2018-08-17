<template>
  <v-app>
    <Sidebar :drawer="drawer"/>
     <v-toolbar color="primary" dark fixed app 
      :clipped-left="$vuetify.breakpoint.lgAndUp">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>CoAPman</v-toolbar-title>
    </v-toolbar>
    <v-content fluid>
      <MainPanel/>
    </v-content>
  </v-app>
</template>

<script>
import MainPanel from "./components/MainPanel";
import Sidebar from "./components/Sidebar";

export default {
  name: "App",
  components: {
    MainPanel,
    Sidebar
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js"
    };
  }
};
</script>
