<script setup lang="ts">
const isActive = true;

// ✅ Valid: Allowed classes with dynamic parts
// @validClasses [custom-button, flex]
</script>

<template>
  <div :class="`custom-button flex ${isActive ? 'bg-blue-500' : ''}`">Allowed dynamic</div>
</template>
