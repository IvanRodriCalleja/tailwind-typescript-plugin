<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ❌ Invalid: Mix with invalid in both static and binary
// @invalidClasses [invalid-static, invalid-binary]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn(['flex', 'invalid-static', isError && 'invalid-binary', 'items-center'])">
  			Mixed with invalid
  		</div>
</template>
