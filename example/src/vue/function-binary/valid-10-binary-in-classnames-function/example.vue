<script setup lang="ts">
import classNames from 'classnames';

const isError = false;

// ✅ Valid: Binary in classNames() function
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="classNames('flex', isError && 'text-red-500')">Binary in classNames()</div>
</template>
