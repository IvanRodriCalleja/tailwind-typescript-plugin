<script setup lang="ts">
import { computed, ref } from 'vue';

// ✅ Valid: Computed property with classes matching patterns
// @validClasses [custom-button, close-icon]
const isActive = ref(true);

const classes = computed(() => [
  'custom-button',
  { 'close-icon': isActive.value }
]);
</script>

<template>
  <div :class="classes">Computed with valid patterns</div>
</template>
