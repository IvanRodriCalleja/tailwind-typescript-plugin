<script setup lang="ts">
import { cn } from '../utils';

const validClasses = ['flex', 'items-center'];
const invalidClasses = ['invalid-mixed-class', 'another-invalid'];

// ❌ Invalid: Mixed spreads with valid and invalid classes
// @invalidClasses [invalid-mixed-class, another-invalid]
</script>

<template>
  <div :class="cn(...validClasses, 'p-4', ...invalidClasses)">Mixed spread invalid</div>
</template>
