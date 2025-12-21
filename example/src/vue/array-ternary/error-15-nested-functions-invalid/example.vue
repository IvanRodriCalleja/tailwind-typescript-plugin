<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Nested functions with invalid ternary in array
// @invalidClasses [invalid-active]
// @validClasses [flex, bg-gray-500, items-center]
</script>

<template>
  <div
  			:class="clsx('flex', cn([isActive ? 'invalid-active' : 'bg-gray-500', 'items-center']))">
  			Nested with invalid
  		</div>
</template>
