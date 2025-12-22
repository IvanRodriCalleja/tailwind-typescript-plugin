<script setup lang="ts">
import clsx from 'clsx';

// Invalid: clsx with nested array containing invalid class
// @invalidClasses [deeply-nested-invalid]
// @validClasses [custom-button, flex, app-header]
</script>

<template>
  <div :class="clsx(['custom-button', ['flex', ['deeply-nested-invalid']]], 'app-header')">
    Nested invalid class
  </div>
</template>
