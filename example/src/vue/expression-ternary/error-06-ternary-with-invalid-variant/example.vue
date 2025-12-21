<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Ternary with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [hover:bg-gray-500]
</script>

<template>
  <div :class="isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500'">
  			Ternary with invalid variant
  		</div>
</template>
