<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Function with ternary expression, invalid in both branches
// @invalidClasses [invalid-active, invalid-inactive]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'invalid-active' : 'invalid-inactive')">
  			Invalid in both branches
  		</div>
</template>
