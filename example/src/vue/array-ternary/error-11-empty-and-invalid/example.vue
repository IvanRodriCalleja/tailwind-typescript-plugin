<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary with invalid in non-empty branch
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'invalid-class' : ''])">Invalid with empty</div>
</template>
