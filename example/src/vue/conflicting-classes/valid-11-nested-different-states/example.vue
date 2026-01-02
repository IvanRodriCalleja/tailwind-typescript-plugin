<script setup lang="ts">
// Valid: Nested prefixes with different states - no conflict
// sm:hover:text-left and sm:focus:text-center have different state modifiers
// @validClasses [sm:hover:text-left, sm:focus:text-center]
</script>

<template>
  <div class="sm:hover:text-left sm:focus:text-center">Different states with same breakpoint - no conflict</div>
</template>
