<script setup lang="ts">
const templateNoSubInvalid = `flex invalid-template`;

// ❌ Invalid: Variable with no-substitution template literal containing invalid
// @invalidClasses [invalid-template]
// @validClasses [flex]
</script>

<template>
  <div :class="templateNoSubInvalid">Template no substitution - invalid</div>
</template>
