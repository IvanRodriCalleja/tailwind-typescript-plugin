<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Object key with multiple classes, one invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx({ 'flex invalid-class items-center': true })">Multiple with invalid</div>
</template>
