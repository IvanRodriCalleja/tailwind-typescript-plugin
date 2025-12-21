<script setup lang="ts">
import clsx from 'clsx';

// Valid: clsx with nested arrays
// @validClasses [custom-button, flex, items-center, app-header, gap-2]
</script>

<template>
  <div :class="clsx(['custom-button', ['flex', 'items-center']], ['app-header', 'gap-2'])">
    Nested arrays
  </div>
</template>
