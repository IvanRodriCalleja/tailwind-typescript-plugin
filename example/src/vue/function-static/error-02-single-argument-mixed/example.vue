<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Single argument with mix of valid and invalid classes
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex invalid-class items-center')">
  			Mixed valid and invalid in one arg
  		</div>
</template>
