<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Object with string literal key, invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx({ flex: true, 'invalid-class': true })">Invalid string key</div>
</template>
