<script setup lang="ts">
// ✅ Valid: Binary that resolves to boolean (falsy case)
</script>

<template>
  <div :class="true && 'text-red-500'">Boolean result</div>
</template>
