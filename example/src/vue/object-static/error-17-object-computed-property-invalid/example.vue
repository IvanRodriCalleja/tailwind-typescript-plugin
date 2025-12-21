<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Computed property name with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx({ ['flex']: true, ['invalid-class']: isActive })">Computed invalid</div>
</template>
