<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary with mix of arbitrary and invalid
// @invalidClasses [invalid-size]
// @validClasses [flex, h-[50vh], h-[30vh]]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]')">
  			Ternary with arbitrary and invalid
  		</div>
</template>
