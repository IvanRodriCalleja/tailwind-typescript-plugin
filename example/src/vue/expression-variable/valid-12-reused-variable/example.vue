<script setup lang="ts">
const reusedValidClasses = 'flex items-center';

// ✅ Valid: Same variable used multiple times
// @validClasses [flex, items-center]
</script>

<template>
  <>
  			<div :class="reusedValidClasses">First usage</div>
  			<div :class="reusedValidClasses">Second usage</div>
  		</>
</template>
