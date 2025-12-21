<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Self-closing with binary in array
// @validClasses [rounded-lg, shadow-md]
</script>

<template>
  <img :class="cn([isActive && 'rounded-lg shadow-md'])" src="test.jpg" alt="test" />
</template>
