<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ✅ Valid: Multiple interpolations with valid static classes
// @validClasses [flex, items-center, justify-between]
</script>

<template>
  <div :class="`flex ${dynamicClass} items-center ${anotherClass} justify-between`">
  			Multiple interpolations with valid classes
  		</div>
</template>
