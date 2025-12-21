<script setup lang="ts">
const isError = false;

// ❌ Invalid: Static invalid class after binary expression
// @invalidClasses [invalid-after]
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="`flex ${isError && 'text-red-500'} invalid-after`">
  			Binary with invalid after
  		</div>
</template>
