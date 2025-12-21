<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Object with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx({ flex: true, 'invalid-variant:bg-blue': isActive })">Invalid variant</div>
</template>
