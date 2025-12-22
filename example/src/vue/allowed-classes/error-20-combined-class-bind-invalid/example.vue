<script setup lang="ts">
// Pattern 10 Error: Combined with invalid in :class
// @invalidClasses [invalid-combined]
// @validClasses [custom-button, flex]
const isActive = true;
</script>

<template>
  <div
    class="custom-button flex"
    :class="{ 'invalid-combined': isActive }"
  >
    Combined with invalid
  </div>
</template>
