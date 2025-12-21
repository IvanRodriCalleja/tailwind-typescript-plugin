<script setup lang="ts">
// ✅ Valid: CSS variables mixed with standard Tailwind
// @validClasses [[--custom-color:#ff0000], bg-[var(--custom-color)], flex, items-center, justify-center, font-bold]
</script>

<template>
  <div class="[--custom-color:#ff0000] bg-[var(--custom-color)] flex items-center justify-center font-bold">
  			CSS variables with Tailwind
  		</div>
</template>
