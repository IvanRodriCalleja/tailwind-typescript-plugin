<script setup lang="ts">
// ✅ Valid: Combination of parentheses and type assertion
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="'flex items-center justify-center' as string">Combined</div>
</template>
