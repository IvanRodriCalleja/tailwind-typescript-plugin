<script setup lang="ts">
const asConstValid = 'bg-blue-500' as const;

// ✅ Valid: Variable with as const assertion
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="asConstValid">As const assertion - valid</div>
</template>
