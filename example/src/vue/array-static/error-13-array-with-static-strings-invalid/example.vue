<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Array with static strings, invalid in array
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, bg-blue-500]
</script>

<template>
  <div :class="cn('flex', ['items-center', 'invalid-class'], 'bg-blue-500')">
  			Array with static invalid
  		</div>
</template>
