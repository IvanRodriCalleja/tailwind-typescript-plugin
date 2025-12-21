<script setup lang="ts">
const hasError = false;
const isLoading = false;

// ❌ Invalid: Ternary with complex condition and invalid class
// @invalidClasses [invalid-alert]
// @validClasses [bg-gray-500]
</script>

<template>
  <div :class="hasError || isLoading ? 'invalid-alert' : 'bg-gray-500'">
  			Complex condition invalid
  		</div>
</template>
