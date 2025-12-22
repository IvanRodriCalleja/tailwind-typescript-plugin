<script setup lang="ts">
// Pattern 4: Object syntax (most idiomatic Vue)
// @validClasses [custom-button, app-header, project-card]
const isActive = true;
const isDisabled = false;
</script>

<template>
  <div :class="{ 'custom-button': true, 'app-header': isActive, 'project-card': isDisabled }">
    Object syntax
  </div>
</template>
