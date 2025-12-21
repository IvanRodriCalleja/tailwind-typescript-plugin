<script setup lang="ts">
import clsx from 'clsx';

// Valid: clsx with mixed strings and array
// @validClasses [custom-button, flex, items-center, app-header]
</script>

<template>
  <div :class="clsx('custom-button', ['flex', 'items-center'], 'app-header')">
    Mixed strings and array
  </div>
</template>
