<script setup lang="ts">
import { ref } from 'vue';

// Pattern 8: ref reactive array
// @validClasses [custom-button, flex, app-header]
const classes = ref(['custom-button', 'flex', 'app-header']);
</script>

<template>
  <div :class="classes">
    Ref reactive
  </div>
</template>
