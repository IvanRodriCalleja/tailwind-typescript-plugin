<script setup lang="ts">
const className: string | null = 'invalid-class';

// ❌ Invalid: Non-null assertion with invalid class
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="className!">Non-null invalid</div>
</template>
