<script setup lang="ts">
// ❌ Invalid: Invalid class in template with allowed classes
// @invalidClasses [invalid-class]
// @validClasses [custom-button, flex]
</script>

<template>
  <div :class="`custom-button flex invalid-class`">Allowed + invalid in template</div>
</template>
