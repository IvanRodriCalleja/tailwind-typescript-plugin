<script setup lang="ts">
const isActive = true;

// 💡 Hint: Multiple extractable classes in ternary
// @extractableClasses [flex, flex, items-center, items-center]
// Both 'flex' and 'items-center' appear in both branches (4 hints total)
</script>

<template>
  <div :class="isActive ? 'flex items-center p-4' : 'flex items-center m-4'">
  			Multiple extractable classes
  		</div>
</template>
