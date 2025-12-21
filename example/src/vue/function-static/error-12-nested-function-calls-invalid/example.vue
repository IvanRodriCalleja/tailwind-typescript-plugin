<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

// ❌ Invalid: Nested function calls with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex', cn('items-center', 'invalid-class'), 'bg-blue-500')">
  			Nested with invalid
  		</div>
</template>
