<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Parenthesized clsx with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isActive && 'invalid-class')">Invalid in clsx</div>
</template>
