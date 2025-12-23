<script setup lang="ts">
const isError = true;

// ❌ Invalid: Combined static class + :class array with binary, invalid class
// @invalidClasses [invalid-combined]
// @validClasses [p-4, flex]
</script>

<template>
  <div class="p-4" :class="['flex', isError && 'invalid-combined']">Combined class + :class</div>
</template>
