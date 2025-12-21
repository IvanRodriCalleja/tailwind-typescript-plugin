<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Binary with mix of arbitrary and invalid in array
// @invalidClasses [invalid-size]
// @validClasses [flex, h-[50vh]]
</script>

<template>
  <div :class="cn(['flex', isActive && 'h-[50vh] invalid-size'])">
  			Binary with arbitrary and invalid
  		</div>
</template>
