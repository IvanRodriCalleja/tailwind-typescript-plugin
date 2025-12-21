<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Self-closing element with invalid class
// @invalidClasses [invalid-class]
// @validClasses [w-full, h-auto]
</script>

<template>
  <img :class="clsx('w-full', 'invalid-class', 'h-auto')" src="test.jpg" alt="test" />
</template>
