<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Invalid class as object key with allowed classes
// @invalidClasses [invalid-class]
// @validClasses [custom-button]
</script>

<template>
  <div :class="clsx({ 'custom-button': true, 'invalid-class': true })">
  			Allowed + invalid in object
  		</div>
</template>
