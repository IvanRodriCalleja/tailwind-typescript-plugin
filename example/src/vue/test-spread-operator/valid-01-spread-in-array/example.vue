<script setup lang="ts">
import { cn } from '../utils';

const baseClasses = ['flex', 'items-center'];

// ✅ Valid: Spread operator with valid classes in array
// @validClasses [flex, items-center, p-4, m-2]
</script>

<template>
  <div :class="cn([...baseClasses, 'p-4', 'm-2'])">Spread in array</div>
</template>
