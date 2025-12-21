<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conditional with arbitrary values
// @validClasses [flex, h-[50vh], h-[100vh]]
</script>

<template>
  <div :class="`flex ${isActive ? 'h-[50vh]' : 'h-[100vh]'}`">
  			Conditional with arbitrary values
  		</div>
</template>
