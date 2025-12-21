<script setup lang="ts">
// ✅ Valid: Deep member expression
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="lib.utils.cn('flex', 'items-center')">Deep member expression</div>
</template>
