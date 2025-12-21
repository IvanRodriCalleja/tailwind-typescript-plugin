<script setup lang="ts">
const isActive = true;

// ✅ Valid: Simple conditional with valid classes in both branches
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`">
  			Simple conditional with valid classes
  		</div>
</template>
