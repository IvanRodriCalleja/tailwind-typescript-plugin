<script setup lang="ts">
// ✅ Valid: Duplicate (same class) is not a conflict
// This triggers duplicate detection, not conflict detection
// @duplicateClasses [flex, flex]
</script>

<template>
  <div class="flex flex items-center">Duplicate, not conflict</div>
</template>
