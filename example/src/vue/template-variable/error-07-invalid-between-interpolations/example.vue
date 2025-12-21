<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ❌ Invalid: Single invalid class between interpolations
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="`${dynamicClass} invalid-class ${anotherClass}`">
  			Invalid between interpolations
  		</div>
</template>
