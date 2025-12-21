<script setup lang="ts">
const outsideValidClass = 'flex items-center';

// ✅ Valid: Variable defined at module level with valid classes
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="outsideValidClass">Valid outside scope</div>
</template>
