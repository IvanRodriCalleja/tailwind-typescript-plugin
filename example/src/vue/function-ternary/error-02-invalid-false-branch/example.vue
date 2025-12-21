<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Function with ternary expression, invalid in false branch
// @invalidClasses [invalid-inactive]
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'bg-blue-500' : 'invalid-inactive')">
  			Invalid in false branch
  		</div>
</template>
