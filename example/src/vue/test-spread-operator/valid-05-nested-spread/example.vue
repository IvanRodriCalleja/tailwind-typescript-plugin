<script setup lang="ts">
import { cn } from '../utils';

const inner = ['flex', 'items-center'];
const outer = [...inner, 'p-4'];

// ✅ Valid: Nested spread expression
// @validClasses [flex, items-center, p-4, m-2]
</script>

<template>
  <div :class="cn([...outer, 'm-2'])">Nested spread</div>
</template>
