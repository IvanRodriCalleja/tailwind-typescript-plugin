<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const isActive = true;

// ❌ Invalid: Nested binary with invalid class
// @invalidClasses [invalid-nested]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isError && isActive && 'invalid-nested'])">
  			Nested binary invalid
  		</div>
</template>
