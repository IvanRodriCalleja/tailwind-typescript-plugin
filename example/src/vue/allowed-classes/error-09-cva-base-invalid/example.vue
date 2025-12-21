<script setup lang="ts">
import { cva } from 'class-variance-authority';

// Invalid: cva with invalid class in base
// @invalidClasses [invalid-base-class]
// @validClasses [custom-button, flex]
const button = cva(['custom-button', 'flex', 'invalid-base-class']);
</script>

<template>
  <button :class="button()">CVA Base Invalid</button>
</template>
