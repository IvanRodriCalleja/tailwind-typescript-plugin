<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Single argument with invalid class
// @invalidClasses [invalid-class]
</script>

<template>
  <div :class="clsx('invalid-class')">Single invalid argument</div>
</template>
