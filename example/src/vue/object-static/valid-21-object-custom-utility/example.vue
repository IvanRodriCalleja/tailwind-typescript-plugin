<script setup lang="ts">
const isActive = true;

// ✅ Valid: Custom utility function with object
// @utilityFunctions [myCustomBuilder]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div
  			:class="myCustomBuilder({ flex: true, 'items-center': true, 'justify-center': isActive })">
  			Custom with object
  		</div>
</template>
