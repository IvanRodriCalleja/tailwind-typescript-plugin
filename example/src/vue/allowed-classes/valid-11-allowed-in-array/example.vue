<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Allowed classes in array
// @validClasses [custom-button, app-header, flex]
</script>

<template>
  <div :class="clsx(['custom-button', 'app-header', 'flex'])">Allowed in array</div>
</template>
