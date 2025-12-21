<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Binary with arbitrary values in array
// @validClasses [flex, h-[50vh], w-[100px]]
</script>

<template>
  <div :class="cn(['flex', isActive && 'h-[50vh] w-[100px]'])">
  			Binary with arbitrary values
  		</div>
</template>
