<script setup lang="ts">
const templateNoSubValid = `flex items-center`;

// ✅ Valid: Variable with no-substitution template literal
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="templateNoSubValid">Template no substitution - valid</div>
</template>
