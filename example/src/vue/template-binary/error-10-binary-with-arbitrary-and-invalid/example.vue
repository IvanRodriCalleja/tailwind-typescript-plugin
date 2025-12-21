<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Binary with mix of arbitrary and invalid classes
// @invalidClasses [invalid-size]
// @validClasses [flex, h-[50vh]]
</script>

<template>
  <div :class="`flex ${isActive && 'h-[50vh] invalid-size'}`">
  			Binary with arbitrary and invalid
  		</div>
</template>
