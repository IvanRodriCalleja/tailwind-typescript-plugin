<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// Valid: clsx with mixed strings and object
// @validClasses [custom-button, flex, app-header]
</script>

<template>
  <div :class="clsx('custom-button', { 'flex': isActive, 'app-header': true })">
    Mixed strings and object
  </div>
</template>
