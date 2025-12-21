<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Self-closing element with invalid in array
// @invalidClasses [invalid-class]
// @validClasses [w-full, h-auto]
</script>

<template>
  <img :class="cn(['w-full', 'invalid-class', 'h-auto'])" src="test.jpg" alt="test" />
</template>
