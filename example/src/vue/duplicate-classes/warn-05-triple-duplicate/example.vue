<script setup lang="ts">
// ⚠️ Warning: Same class appears three times
// @duplicateClasses [flex, flex, flex]
// All three "flex" occurrences should show warnings
</script>

<template>
  <div class="flex flex flex items-center">Triple duplicate</div>
</template>
