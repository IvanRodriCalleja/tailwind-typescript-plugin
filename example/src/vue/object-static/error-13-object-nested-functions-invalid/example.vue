<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Nested functions with invalid in object
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				cn({ 'items-center': true, 'invalid-class': isActive }),
  				'bg-blue-500'
  			)">
  			Nested invalid
  		</div>
</template>
