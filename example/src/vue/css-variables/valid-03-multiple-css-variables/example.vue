<script setup lang="ts">
// ✅ Valid: Multiple CSS variable definitions
// @validClasses [[--color-primary:#3b82f6], [--color-secondary:#8b5cf6], [--spacing:1rem]]
</script>

<template>
  <div class="[--color-primary:#3b82f6] [--color-secondary:#8b5cf6] [--spacing:1rem]">
  			Multiple CSS variables
  		</div>
</template>
