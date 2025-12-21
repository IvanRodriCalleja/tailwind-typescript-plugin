<script setup lang="ts">
const validSingleClass = 'bg-blue-500';

// ✅ Valid: Direct variable reference with valid class
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="validSingleClass">Direct variable reference</div>
</template>
