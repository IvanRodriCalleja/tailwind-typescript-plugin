<script setup lang="ts">
// ❌ Invalid: Combination with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="'flex invalid-class' as string">Combined invalid</div>
</template>
