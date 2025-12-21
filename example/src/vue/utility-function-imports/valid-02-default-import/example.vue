<script setup lang="ts">
import classBuilder from 'my-class-builder';

// ✅ Valid: Default import from the correct package with valid classes
// @utilityFunctions [{"name": "classBuilder", "from": "my-class-builder"}]
// @validClasses [flex, gap-4, p-4]
</script>

<template>
  <div :class="classBuilder('flex', 'gap-4', 'p-4')">Default import</div>
</template>
