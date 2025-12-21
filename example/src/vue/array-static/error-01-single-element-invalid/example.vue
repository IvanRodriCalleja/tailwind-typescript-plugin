<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Single element array with invalid class
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="cn(['invalid-class'])">Single element invalid</div>
</template>
