<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Invalid class in last argument
// @invalidClasses [invalid-last]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex', 'items-center', 'invalid-last')">Invalid in last</div>
</template>
