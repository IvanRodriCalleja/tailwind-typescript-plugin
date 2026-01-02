<script setup lang="ts">
// Valid: Nested prefixes with different breakpoints - no conflict
// sm:hover:text-left and md:hover:text-center apply at different breakpoints
// @validClasses [sm:hover:text-left, md:hover:text-center]
</script>

<template>
  <div class="sm:hover:text-left md:hover:text-center">Different breakpoints with nested prefixes - no conflict</div>
</template>
