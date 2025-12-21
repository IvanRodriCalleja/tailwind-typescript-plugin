<script setup lang="ts">
// ❌ Invalid: Invalid class in the middle
// @invalidClasses [invalidclass]
// @validClasses [flex, items-center]
</script>

<template>
  <div class="flex invalidclass items-center">Invalid middle</div>
</template>
