<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Self-closing with invalid ternary in array
// @invalidClasses [invalid-style]
// @validClasses [rounded-lg]
</script>

<template>
  <img :class="cn([isActive ? 'invalid-style' : 'rounded-lg'])" src="test.jpg" alt="test" />
</template>
