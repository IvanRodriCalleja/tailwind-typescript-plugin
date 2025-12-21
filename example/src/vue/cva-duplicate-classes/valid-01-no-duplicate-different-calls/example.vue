<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['flex', 'items-center']);
const card = cva(['flex', 'justify-center']);

// ✅ Valid: Same class in different cva() calls
// Each cva() has its own scope
// @validClasses [flex, items-center, flex, justify-center]
</script>

<template>
  <>
  			<button :class="button()">Button</button>
  			<div :class="card()">Card</div>
  		</>
</template>
