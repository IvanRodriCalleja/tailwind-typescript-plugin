<script setup lang="ts">
// ❌ Invalid: Simple string config with invalid class
// @utilityFunctions [customFn]
// @invalidClasses [bad-class]
// @validClasses [flex]
</script>

<template>
  <div :class="customFn('flex', 'bad-class')">Simple string config with invalid class</div>
</template>
