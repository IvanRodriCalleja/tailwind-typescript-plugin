<script setup lang="ts">
// Valid: Base hover vs responsive hover - no conflict
// hover:text-left applies at all breakpoints on hover
// md:hover:text-center applies only at md+ breakpoint on hover
// @validClasses [hover:text-left, md:hover:text-center]
</script>

<template>
  <div class="hover:text-left md:hover:text-center">Base hover vs responsive hover - no conflict</div>
</template>
