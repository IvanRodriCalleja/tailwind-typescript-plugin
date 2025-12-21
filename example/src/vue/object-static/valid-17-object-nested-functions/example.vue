<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Nested functions with objects
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				cn({ 'items-center': true, 'justify-center': isActive }),
  				'bg-blue-500'
  			)">
  			Nested with object
  		</div>
</template>
