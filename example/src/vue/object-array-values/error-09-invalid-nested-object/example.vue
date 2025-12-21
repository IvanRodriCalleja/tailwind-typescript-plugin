<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// ❌ Invalid: Object inside array value with invalid
// @invalidClasses [invalid-nested-obj]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div
  			:class="clsx({
  				flex: ['items-center', { 'justify-center': true, 'invalid-nested-obj': isActive }]
  			})">
  			Invalid object in array
  		</div>
</template>
