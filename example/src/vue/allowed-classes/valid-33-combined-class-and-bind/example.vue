<script setup lang="ts">
// Pattern 10: Combined static class + dynamic :class
// Vue merges them automatically
// @validClasses [custom-button, flex, app-header, project-card]
const isActive = true;
</script>

<template>
  <div
    class="custom-button flex"
    :class="{ 'app-header': isActive, 'project-card': !isActive }"
  >
    Combined class + :class
  </div>
</template>
