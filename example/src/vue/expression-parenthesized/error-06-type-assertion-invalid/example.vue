<script setup lang="ts">
// ❌ Invalid: Type assertion with invalid class
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="'invalid-class' as string">Type assertion invalid</div>
</template>
