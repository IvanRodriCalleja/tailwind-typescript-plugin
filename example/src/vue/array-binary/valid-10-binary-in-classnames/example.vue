<script setup lang="ts">
import classNames from 'classnames';

const isError = true;

// ✅ Valid: Binary in array with classNames()
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="classNames(['flex', isError && 'text-red-500'])">Binary in classNames</div>
</template>
