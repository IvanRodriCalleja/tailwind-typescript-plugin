<script setup lang="ts">
// ❌⚠️ Both invalid class error AND duplicate warning
// @invalidClasses [invalidclass]
// @duplicateClasses [flex, flex]
// Should show:
// - Error on "invalidclass" (not a valid Tailwind class)
// - Warning on both "flex" occurrences (duplicate)
</script>

<template>
  <div class="flex invalidclass flex items-center">Invalid and duplicate</div>
</template>
