<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ❌ Invalid: Mix with invalid in both static and binary
// @invalidClasses [invalid-static, invalid-binary]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex', 'invalid-static', isError && 'invalid-binary', 'items-center')">
  			Mixed with invalid
  		</div>
</template>
