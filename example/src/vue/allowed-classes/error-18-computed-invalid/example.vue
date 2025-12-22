<script setup lang="ts">
import { computed, ref } from 'vue';

// Pattern 6 Error: Computed with invalid class
// @invalidClasses [invalid-computed]
// @validClasses [custom-button]
const isActive = ref(true);

const classes = computed(() => [
  'custom-button',
  { 'invalid-computed': isActive.value }
]);
</script>

<template>
  <div :class="classes">
    Computed with invalid
  </div>
</template>
