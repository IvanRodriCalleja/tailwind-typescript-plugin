<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const isPrimary = false;

// Valid: clsx with conditional values
// @validClasses [custom-button, flex, app-header, project-card]
</script>

<template>
  <div :class="clsx('custom-button', isActive && 'flex', isPrimary ? 'app-header' : 'project-card')">
    Conditional classes
  </div>
</template>
