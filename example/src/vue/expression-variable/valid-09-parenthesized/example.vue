<script setup lang="ts">
const parenthesizedValid = 'bg-blue-500';

// ✅ Valid: Variable with parenthesized expression
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="parenthesizedValid">Parenthesized expression - valid</div>
</template>
