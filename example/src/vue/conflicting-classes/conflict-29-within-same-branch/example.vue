<script setup lang="ts">
const isActive = true;

// ⚠️ Warning: Conflicts WITHIN same ternary branch
// @conflictClasses [text-left, text-center]
// Both text-left and text-center are in the true branch
</script>

<template>
  <div :class="isActive ? 'text-left text-center' : 'text-right'">
  			Conflict within same branch
  		</div>
</template>
