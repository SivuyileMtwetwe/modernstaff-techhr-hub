<template>
  <div id="app">
    <AppHeader />
    <AppSidebar />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';
import AppSidebar from './components/common/AppSidebar.vue';
import AppFooter from './components/common/AppFooter.vue';

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
