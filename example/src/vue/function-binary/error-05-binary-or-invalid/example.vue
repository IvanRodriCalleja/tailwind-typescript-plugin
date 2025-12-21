<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ❌ Invalid: Function with OR binary expression, invalid class
// @invalidClasses [invalid-fallback]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isError || 'invalid-fallback')">OR with invalid class</div>
</template>
