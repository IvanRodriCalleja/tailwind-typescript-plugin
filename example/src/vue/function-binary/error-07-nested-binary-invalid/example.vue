<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const isActive = true;

// ❌ Invalid: Nested binary with invalid class
// @invalidClasses [invalid-nested]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isError && isActive && 'invalid-nested')">
  			Nested binary invalid
  		</div>
</template>
