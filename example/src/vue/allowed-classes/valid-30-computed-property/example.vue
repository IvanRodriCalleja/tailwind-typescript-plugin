<script setup lang="ts">
import { computed, ref } from 'vue';

// Pattern 6: Computed property
// @validClasses [custom-button, flex, app-header]
const isActive = ref(true);
const sizeClass = ref('app-header');

const classes = computed(() => [
  'custom-button',
  { 'flex': isActive.value },
  sizeClass.value
]);
</script>

<template>
  <div :class="classes">
    Computed property
  </div>
</template>
