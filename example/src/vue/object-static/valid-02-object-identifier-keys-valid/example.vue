<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Object with identifier keys, all valid
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx({ flex: true, 'items-center': true })">Identifier keys</div>
</template>
