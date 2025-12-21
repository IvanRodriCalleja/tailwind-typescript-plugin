<script setup lang="ts">
const className: string | null = 'flex items-center';

// ✅ Valid: Non-null assertion
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="className!">Non-null assertion</div>
</template>
