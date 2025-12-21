<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Mix of object and static strings
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx('flex', { 'items-center': true, 'justify-center': isActive }, 'bg-blue-500')">
  			Mixed with static
  		</div>
</template>
