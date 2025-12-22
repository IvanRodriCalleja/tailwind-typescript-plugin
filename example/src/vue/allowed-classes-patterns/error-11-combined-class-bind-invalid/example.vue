<script setup lang="ts">
// ❌ Invalid: Combined static class + :class with invalid in :class
// @invalidClasses [invalid-combined]
// @validClasses [custom-button, close-icon]
</script>

<template>
  <div class="custom-button" :class="['invalid-combined', 'close-icon']">
    Combined with invalid
  </div>
</template>
