<script setup lang="ts">
import clsx from 'clsx';

const isError = true;

// ❌ Invalid: Binary in array with clsx() invalid
// @invalidClasses [invalid-error]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx(['flex', isError && 'invalid-error'])">Binary in clsx invalid</div>
</template>
