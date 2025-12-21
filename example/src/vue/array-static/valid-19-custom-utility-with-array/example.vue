<script setup lang="ts">
// ✅ Valid: Custom utility function with array
// @utilityFunctions [myCustomBuilder]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="myCustomBuilder(['flex', 'items-center', 'justify-center'])">
  			Custom with array
  		</div>
</template>
