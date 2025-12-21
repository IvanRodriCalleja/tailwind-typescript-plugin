<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Nested parentheses with invalid class
// @invalidClasses [invalid-class]
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'invalid-class' : 'bg-gray-500'">Nested invalid</div>
</template>
