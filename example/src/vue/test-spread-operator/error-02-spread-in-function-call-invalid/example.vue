<script setup lang="ts">
import { cn } from '../utils';

const baseClasses = ['flex', 'invalid-cn-spread'];

// ❌ Invalid: Spread operator with invalid class in function call
// @invalidClasses [invalid-cn-spread]
</script>

<template>
  <div :class="cn(...baseClasses, 'items-center')">Spread in cn() with invalid</div>
</template>
