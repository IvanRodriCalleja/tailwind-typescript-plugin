<script setup lang="ts">
const invalidImgClasses = 'w-full invalid-img-class';

// ❌ Invalid: Self-closing element with invalid variable
// @invalidClasses [invalid-img-class]
// @validClasses [w-full]
</script>

<template>
  <img :class="invalidImgClasses" src="test.jpg" alt="test" />
</template>
