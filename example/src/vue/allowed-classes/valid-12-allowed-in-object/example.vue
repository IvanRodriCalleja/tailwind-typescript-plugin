<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Allowed classes as object keys
// @validClasses [custom-button, app-header]
</script>

<template>
  <div :class="clsx({ 'custom-button': true, 'app-header': true })">Allowed in object</div>
</template>
