<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = false;

// ❌ Invalid: Binary in cn() with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="cn('flex', isError && 'invalid-class')">Binary in cn() invalid</div>
</template>
