<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with static invalid class before conditional
// @invalidClasses [invalid-class, invalid-bg]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="`flex invalid-class ${isActive ? 'invalid-bg' : 'bg-gray-500'}`">
  			Static invalid class with conditional
  		</div>
</template>
