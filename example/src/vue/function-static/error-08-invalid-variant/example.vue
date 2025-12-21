<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Function with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', 'invalid-variant:bg-blue')">Function with invalid variant</div>
</template>
