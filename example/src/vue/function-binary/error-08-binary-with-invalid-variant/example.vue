<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Binary with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isActive && 'invalid-variant:bg-blue')">
  			Binary with invalid variant
  		</div>
</template>
