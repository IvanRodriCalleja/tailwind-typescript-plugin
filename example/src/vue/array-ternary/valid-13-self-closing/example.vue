<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Self-closing with ternary in array
// @validClasses [rounded-lg, rounded-sm]
</script>

<template>
  <img :class="cn([isActive ? 'rounded-lg' : 'rounded-sm'])" src="test.jpg" alt="test" />
</template>
