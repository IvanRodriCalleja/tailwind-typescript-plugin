<script setup lang="ts">
// ✅ Valid: Template literal without interpolation (no-substitution template)
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="`flex items-center`">No interpolation</div>
</template>
