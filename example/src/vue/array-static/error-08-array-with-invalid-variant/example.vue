<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Array with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex]
</script>

<template>
  <div :class="cn(['flex', 'invalid-variant:bg-blue'])">Array with invalid variant</div>
</template>
