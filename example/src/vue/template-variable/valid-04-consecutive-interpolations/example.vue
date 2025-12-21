<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ✅ Valid: Consecutive interpolations with classes between
// @validClasses [flex, p-4]
</script>

<template>
  <div :class="`${dynamicClass} flex ${anotherClass} p-4`">Consecutive interpolations</div>
</template>
