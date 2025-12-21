<script setup lang="ts">
import { cn } from '../utils';

const baseClasses = ['flex', 'invalid-spread-class'];

// ❌ Invalid: Spread operator with invalid class in array
// @invalidClasses [invalid-spread-class]
</script>

<template>
  <div :class="cn([...baseClasses, 'items-center'])">Spread with invalid</div>
</template>
