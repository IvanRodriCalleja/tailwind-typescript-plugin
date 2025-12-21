<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Multiple arguments with mix of valid and invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex', 'invalid-class', 'items-center')">Mixed arguments</div>
</template>
