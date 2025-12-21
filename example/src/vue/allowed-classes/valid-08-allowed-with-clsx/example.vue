<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Allowed classes with clsx
// @validClasses [custom-button, app-header, flex]
</script>

<template>
  <div :class="clsx('custom-button', 'app-header', 'flex')">Allowed with clsx</div>
</template>
