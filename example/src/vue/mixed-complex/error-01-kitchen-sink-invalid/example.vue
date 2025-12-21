<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Kitchen sink with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, justify-center, text-white]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				[1 && 'items-center', { 'justify-center': false, 'invalid-class': null }, ['text-white']],
  				'text-white'
  			)">
  			Invalid kitchen sink
  		</div>
</template>
