<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ⚠️ Warning: Duplicate - base class repeated in ternary branch
// @duplicateClasses [items-center, items-center]
</script>

<template>
  <div :class="cn('flex items-center', isActive ? 'items-center' : 'items-start')">
  			Duplicate base and ternary
  		</div>
</template>
