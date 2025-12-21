<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Binary expression with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${isActive && 'invalid-variant:bg-blue'}`">
  			Binary with invalid variant
  		</div>
</template>
