<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Mix of allowed and invalid in array
// @invalidClasses [invalid-class]
// @validClasses [custom-button, flex]
</script>

<template>
  <div :class="clsx(['custom-button', 'invalid-class', 'flex'])">
  			Allowed + invalid in array
  		</div>
</template>
