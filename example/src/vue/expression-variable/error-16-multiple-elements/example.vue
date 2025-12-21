<script setup lang="ts">
const firstChildClasses = 'flex';
const secondChildClasses = 'bad-class';
const thirdChildClasses = 'grid another-bad';

// ❌ Invalid: Multiple elements with different variables
// @invalidClasses [bad-class, another-bad]
// @validClasses [flex, grid, flex-col]
</script>

<template>
  <div class="flex flex-col">
  			<div :class="firstChildClasses">Valid variable</div>
  			<div :class="secondChildClasses">Invalid variable</div>
  			<div :class="thirdChildClasses">Mixed variable</div>
  		</div>
</template>
