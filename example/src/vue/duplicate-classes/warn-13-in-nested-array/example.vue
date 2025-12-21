<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ⚠️ Warning: Duplicate in nested array
// @duplicateClasses [p-4, p-4]
</script>

<template>
  <div
  			:class="cn([
  				['p-4', 'flex'],
  				['items-center', 'p-4']
  			])">
  			Duplicate in nested array
  		</div>
</template>
