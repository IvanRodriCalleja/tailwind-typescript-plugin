<script setup lang="ts">
import { cva } from 'class-variance-authority';

// Valid: cva with allowed classes in base
// @validClasses [custom-button, flex, rounded]
const button = cva(['custom-button', 'flex', 'rounded']);
</script>

<template>
  <button :class="button()">CVA Base Allowed</button>
</template>
