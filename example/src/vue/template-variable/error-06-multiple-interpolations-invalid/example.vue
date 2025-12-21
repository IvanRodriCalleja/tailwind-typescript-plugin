<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ❌ Invalid: Multiple interpolations with invalid classes in different positions
// @invalidClasses [invalid-first, invalid-middle, invalid-last]
// @validClasses [flex]
</script>

<template>
  <div
  			:class="`invalid-first ${dynamicClass} invalid-middle flex ${anotherClass} invalid-last`">
  			Multiple interpolations with invalid classes
  		</div>
</template>
