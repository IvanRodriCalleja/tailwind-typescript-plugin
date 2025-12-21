<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary in cn() with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="cn('flex', isActive ? 'invalid-class' : 'bg-gray-500')">
  			Ternary in cn() invalid
  		</div>
</template>
