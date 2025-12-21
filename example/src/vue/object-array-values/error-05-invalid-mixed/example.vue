<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Mix of boolean and array values with invalid
// @invalidClasses [invalid-mix]
// @validClasses [flex, items-center, justify-center, text-white]
</script>

<template>
  <div
  			:class="clsx({
  				flex: true,
  				'items-center': ['justify-center', 'invalid-mix'],
  				'text-white': true
  			})">
  			Invalid mixed
  		</div>
</template>
