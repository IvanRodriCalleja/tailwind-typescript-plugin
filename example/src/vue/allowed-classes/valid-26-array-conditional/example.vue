<script setup lang="ts">
// Pattern 3: Array with conditional (&&)
// @validClasses [custom-button, flex, app-header]
const isActive = true;
</script>

<template>
  <div :class="['custom-button', isActive && 'flex', 'app-header']">
    Array conditional
  </div>
</template>
