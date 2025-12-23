<script setup lang="ts">
const isError = true;

// ✅ Valid: Combined static class + :class array with binary, all valid
// @validClasses [p-4, flex, text-red-500]
</script>

<template>
  <div class="p-4" :class="['flex', isError && 'text-red-500']">Combined class + :class</div>
</template>
