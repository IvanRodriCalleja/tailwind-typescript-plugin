<script setup lang="ts">
// ✅ Valid: CSS variables with hover variants
// @validClasses [[--hover-color:#3b82f6], hover:bg-[var(--hover-color)], transition-colors]
</script>

<template>
  <div class="[--hover-color:#3b82f6] hover:bg-[var(--hover-color)] transition-colors">
  			Hover CSS variables
  		</div>
</template>
