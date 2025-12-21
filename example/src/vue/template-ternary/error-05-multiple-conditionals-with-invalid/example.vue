<script setup lang="ts">
const isActive = true;
const isError = false;

// ❌ Invalid: Multiple conditionals with some invalid classes
// @invalidClasses [invalid-bg, invalid-text]
// @validClasses [flex, bg-blue-500, text-white]
</script>

<template>
  <div
  			:class="`flex ${isActive ? 'bg-blue-500' : 'invalid-bg'} ${isError ? 'invalid-text' : 'text-white'}`">
  			Multiple conditionals with invalid classes
  		</div>
</template>
