<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Binary with invalid variant in array
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isActive && 'invalid-variant:bg-blue'])">
  			Binary with invalid variant
  		</div>
</template>
