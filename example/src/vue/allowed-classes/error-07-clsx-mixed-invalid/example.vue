<script setup lang="ts">
import clsx from 'clsx';

// Invalid: clsx with mixed args containing invalid class
// @invalidClasses [invalid-class]
// @validClasses [custom-button, flex, app-header]
</script>

<template>
  <div :class="clsx('custom-button', ['flex', 'invalid-class'], 'app-header')">
    Mixed with invalid class
  </div>
</template>
