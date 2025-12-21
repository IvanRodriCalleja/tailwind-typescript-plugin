<script setup lang="ts">
// ❌ Invalid: Template literal without interpolation, with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="`flex invalid-class`">No interpolation with invalid class</div>
</template>
