<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Invalid class in middle argument
// @invalidClasses [invalid-middle]
// @validClasses [flex, justify-center]
</script>

<template>
  <div :class="clsx('flex', 'invalid-middle', 'justify-center')">Invalid in middle</div>
</template>
