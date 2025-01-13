<template>
    <div class="loader-overlay">
      <span class="loader"></span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoaderOverlay'
  }
  </script>
  
  <style scoped>
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  </style>