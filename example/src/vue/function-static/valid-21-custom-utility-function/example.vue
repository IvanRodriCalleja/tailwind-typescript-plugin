<script setup lang="ts">
// ✅ Valid: Custom utility function with valid classes
// @utilityFunctions [myCustomBuilder]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="myCustomBuilder('flex', 'items-center', 'justify-center')">
  			Custom utility function
  		</div>
</template>
