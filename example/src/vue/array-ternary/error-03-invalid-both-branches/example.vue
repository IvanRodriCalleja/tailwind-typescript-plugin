<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Array with ternary, invalid in both branches
// @invalidClasses [invalid-active, invalid-inactive]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'invalid-active' : 'invalid-inactive'])">
  			Invalid in both branches
  		</div>
</template>
