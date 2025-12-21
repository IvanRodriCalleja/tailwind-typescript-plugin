<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';

// ❌ Invalid: Self-closing element with invalid class in template
// @invalidClasses [invalid-class]
// @validClasses [w-full]
</script>

<template>
  <img :class="`invalid-class ${dynamicClass} w-full`" src="test.jpg" alt="test" />
</template>
