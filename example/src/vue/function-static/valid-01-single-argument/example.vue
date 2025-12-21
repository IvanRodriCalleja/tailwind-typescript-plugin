<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Single argument with valid class
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex')">Single valid argument</div>
</template>
