<script setup lang="ts">
// ✅ Valid: Simple string config matches any function with that name (no import check)
// @utilityFunctions [myUtil]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="myUtil('flex', 'items-center')">
  			Simple string matches without import verification
  		</div>
</template>
