<script setup lang="ts">
const validClass = 'flex';

// ✅ Valid: Variable with valid class used in array
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="[validClass, 'items-center']">Valid var in array</div>
</template>
