<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Mix with invalid in both object and static
// @invalidClasses [invalid-static, invalid-object]
// @validClasses [flex, items-center]
</script>

<template>
  <div
  			:class="clsx('flex', 'invalid-static', {
  				'items-center': true,
  				'invalid-object': isActive
  			})">
  			Mixed invalid
  		</div>
</template>
