<script setup lang="ts">
import { cva as myCva } from 'class-variance-authority';

// ✅ Valid: Import aliasing - using myCva instead of cva
// @validClasses [flex, items-center, gap-2, bg-blue-500]
</script>

<template>
  <div :class="component({ variant: 'primary' })">Valid Aliased</div>
</template>
