<script setup lang="ts">
const isActive = true;

// 💡 Hint: Simple ternary without utility function
// @extractableClasses [flex, flex]
</script>

<template>
  <div :class="isActive ? 'flex bg-blue-500' : 'flex bg-gray-500'">
  			Simple ternary extractable
  		</div>
</template>
