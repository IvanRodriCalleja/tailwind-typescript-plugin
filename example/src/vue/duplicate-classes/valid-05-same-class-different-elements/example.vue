<script setup lang="ts">
// ✅ Valid: Same class in different elements
// "flex" appears in two different className attributes - this is NOT a duplicate
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div class="flex items-center">
  			<span class="flex justify-center">Same class, different elements</span>
  		</div>
</template>
