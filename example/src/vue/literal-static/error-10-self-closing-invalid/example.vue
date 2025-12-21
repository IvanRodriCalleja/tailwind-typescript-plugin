<script setup lang="ts">
// ❌ Invalid: Self-closing element with invalid class
// @invalidClasses [invalidclass]
// @validClasses [w-full]
</script>

<template>
  <img class="invalidclass w-full" src="test.jpg" alt="test" />
</template>
