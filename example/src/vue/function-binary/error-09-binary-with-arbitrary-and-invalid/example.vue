<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Binary with mix of arbitrary and invalid
// @invalidClasses [invalid-size]
// @validClasses [flex, h-[50vh]]
</script>

<template>
  <div :class="clsx('flex', isActive && 'h-[50vh] invalid-size')">
  			Binary with arbitrary and invalid
  		</div>
</template>
