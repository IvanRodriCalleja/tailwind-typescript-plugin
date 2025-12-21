<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Computed property name with string literal
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx({ ['flex']: true, ['items-center']: isActive })">Computed property</div>
</template>
