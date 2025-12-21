<script setup lang="ts">
// ✅ Valid: Allowed classes in template literal
// @validClasses [custom-button, flex, items-center]
</script>

<template>
  <div :class="`custom-button flex items-center`">Allowed in template</div>
</template>
