<script setup lang="ts">
import clsx from 'clsx';

// ⚠️ Warning: Duplicate in object keys
// Note: Object syntax uses class names as keys, duplicates can occur with string values
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="clsx('flex', { flex: true, 'items-center': true })">
  			Duplicate in object with string
  		</div>
</template>
