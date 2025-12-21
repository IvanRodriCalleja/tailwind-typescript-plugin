<script setup lang="ts">
// ❌ Invalid: Invalid class at the end
// @invalidClasses [invalidclass]
// @validClasses [flex, items-center]
</script>

<template>
  <div class="flex items-center invalidclass">Invalid last</div>
</template>
