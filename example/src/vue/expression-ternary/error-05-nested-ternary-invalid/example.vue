<script setup lang="ts">
const isActive = true;
const isDisabled = false;

// ❌ Invalid: Nested ternary with invalid class
// @invalidClasses [invalid-nested]
// @validClasses [bg-green-500, bg-gray-500]
</script>

<template>
  <div :class="isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'">
  			Nested ternary invalid
  		</div>
</template>
