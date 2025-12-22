<script setup lang="ts">
import { ref } from 'vue';

// Pattern 7: Function returning classes
// @validClasses [custom-button, flex, app-header]
const isActive = ref(true);

function getClasses() {
  return ['custom-button', { 'flex': isActive.value }, 'app-header'];
}
</script>

<template>
  <div :class="getClasses()">
    Function call
  </div>
</template>
