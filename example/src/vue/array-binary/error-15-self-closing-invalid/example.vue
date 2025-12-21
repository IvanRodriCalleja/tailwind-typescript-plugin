<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Self-closing with invalid binary in array
// @invalidClasses [invalid-style]
// @validClasses [rounded-lg]
</script>

<template>
  <img :class="cn([isActive && 'rounded-lg invalid-style'])" src="test.jpg" alt="test" />
</template>
