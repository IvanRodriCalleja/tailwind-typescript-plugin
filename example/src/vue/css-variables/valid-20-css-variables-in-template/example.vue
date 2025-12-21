<script setup lang="ts">
// ✅ Valid: CSS variables in template literal
// @validClasses [[--spacing:1rem], p-[var(--spacing)], flex]
</script>

<template>
  <div :class="`[--spacing:1rem] p-[var(--spacing)] flex`">CSS variables in template</div>
</template>
