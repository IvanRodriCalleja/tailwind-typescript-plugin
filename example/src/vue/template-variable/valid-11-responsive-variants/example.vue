<script setup lang="ts">
const dynamicClass = 'some-dynamic-class';
const anotherClass = 'another-class';

// ✅ Valid: Responsive variants with interpolation
// @validClasses [sm:flex, md:grid, lg:grid-cols-3, xl:grid-cols-4]
</script>

<template>
  <div
  			:class="`sm:flex ${dynamicClass} md:grid lg:grid-cols-3 ${anotherClass} xl:grid-cols-4`">
  			Responsive variants with interpolation
  		</div>
</template>
