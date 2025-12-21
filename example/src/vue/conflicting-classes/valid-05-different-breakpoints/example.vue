<script setup lang="ts">
// ✅ Valid: Different responsive variants - no conflict
// sm:text-left and md:text-center apply at different breakpoints
// @validClasses [sm:text-left, md:text-center]
</script>

<template>
  <div class="sm:text-left md:text-center">Different breakpoints - no conflict</div>
</template>
