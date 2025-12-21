<script setup lang="ts">
const invalidVariant = 'flex invalidvariant:bg-blue-500';

// ❌ Invalid: Variable with invalid variant
// @invalidClasses [invalidvariant:bg-blue-500]
// @validClasses [flex]
</script>

<template>
  <div :class="invalidVariant">Invalid variant in variable</div>
</template>
