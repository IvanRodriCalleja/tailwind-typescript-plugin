<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Conditional with invalid classes in both branches
// @invalidClasses [invalid-active, invalid-inactive]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex ${isActive ? 'invalid-active' : 'invalid-inactive'}`">
  			Invalid classes in both branches
  		</div>
</template>
