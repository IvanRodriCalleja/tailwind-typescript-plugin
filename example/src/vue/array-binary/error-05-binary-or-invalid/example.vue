<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ❌ Invalid: Binary OR in array with invalid class
// @invalidClasses [invalid-fallback]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isError || 'invalid-fallback'])">Binary OR invalid</div>
</template>
