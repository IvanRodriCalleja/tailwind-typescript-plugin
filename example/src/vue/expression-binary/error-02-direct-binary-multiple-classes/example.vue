<script setup lang="ts">
const isError = true;

// ❌ Invalid: Binary expression with multiple classes, one invalid
// @invalidClasses [invalid-class]
// @validClasses [text-red-500, font-bold]
</script>

<template>
  <div :class="isError && 'text-red-500 invalid-class font-bold'">
  			Binary with multiple classes
  		</div>
</template>
