<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Binary with mix of arbitrary and invalid
// @invalidClasses [invalid-size]
// @validClasses [h-[50vh]]
</script>

<template>
  <div :class="isActive && 'h-[50vh] invalid-size'">Binary with arbitrary and invalid</div>
</template>
