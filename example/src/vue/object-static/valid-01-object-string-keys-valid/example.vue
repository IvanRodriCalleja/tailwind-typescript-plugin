<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Object with string literal keys, all valid
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx({ flex: true, 'items-center': true })">Object with string keys</div>
</template>
