<script setup lang="ts">
// ✅ Valid: Another custom function
// @utilityFunctions [buildStyles]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="buildStyles('flex', 'items-center')">Another custom function</div>
</template>
