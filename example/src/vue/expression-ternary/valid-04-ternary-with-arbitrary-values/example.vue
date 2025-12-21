<script setup lang="ts">
const isActive = true;

// ✅ Valid: Ternary with arbitrary values
// @validClasses [h-[50vh], w-[100px], h-[30vh], w-[50px]]
</script>

<template>
  <div :class="isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]'">
  			Ternary with arbitrary values
  		</div>
</template>
