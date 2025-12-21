<script setup lang="ts">
// ❌ Invalid: Type assertion with mixed classes
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="'flex invalid-class' as string">Type assertion mixed</div>
</template>
