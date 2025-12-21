<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Function with ternary expression, invalid in true branch
// @invalidClasses [invalid-active]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'invalid-active' : 'bg-gray-500')">
  			Invalid in true branch
  		</div>
</template>
