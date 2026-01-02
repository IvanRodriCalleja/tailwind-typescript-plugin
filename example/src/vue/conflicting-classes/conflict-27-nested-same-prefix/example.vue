<script setup lang="ts">
// Warning: Nested prefixes with same prefix - conflict
// sm:hover:text-left and sm:hover:text-center have the same prefix
// @conflictClasses [sm:hover:text-left, sm:hover:text-center]
</script>

<template>
  <div class="sm:hover:text-left sm:hover:text-center">Same nested prefix - conflict</div>
</template>
