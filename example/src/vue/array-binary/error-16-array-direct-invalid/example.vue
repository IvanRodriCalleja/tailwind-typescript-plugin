<script setup lang="ts">
const isError = true;

// ❌ Invalid: Direct array syntax without cn/clsx, with invalid class
// @invalidClasses [invalid-direct]
// @validClasses [flex]
</script>

<template>
  <div :class="['flex', isError && 'invalid-direct']">Direct array with binary</div>
</template>
