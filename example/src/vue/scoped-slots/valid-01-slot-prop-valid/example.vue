<script setup lang="ts">
// ✅ Valid: Class from scoped slot prop with valid classes
// @validClasses [flex, items-center, gap-2]

const slotProps = {
  buttonClass: 'flex items-center gap-2'
};
</script>

<template>
  <div :class="slotProps.buttonClass">Valid slot prop class</div>
</template>
