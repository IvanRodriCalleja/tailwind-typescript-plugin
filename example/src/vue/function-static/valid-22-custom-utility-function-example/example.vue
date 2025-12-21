<script setup lang="ts">
// ✅ Valid: Custom utility function (example - requires config)
// @utilityFunctions [myCustomBuilder]
// Note: This demonstrates the @utilityFunctions annotation.
// To actually validate this, add "utilityFunctions": ["myCustomBuilder"] to your tsconfig.json
// @validClasses [flex, items-center, bg-blue-500]
</script>

<template>
  <div :class="myCustomBuilder('flex', 'items-center', 'bg-blue-500')">
  			Custom utility example
  		</div>
</template>
