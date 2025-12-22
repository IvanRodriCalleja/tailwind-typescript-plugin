<script setup lang="ts">
// Pattern 12: Template literal with props
// @validClasses [custom-button, flex]
const props = defineProps<{
  variant?: 'primary' | 'secondary'
}>();

// Using allowed classes with template literal
</script>

<template>
  <div :class="`custom-button flex`">
    Template literal
  </div>
</template>
