<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Single element array with valid class
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex'])">Single element array</div>
</template>
