<script setup lang="ts">
import { styles } from 'my-library/utils';

// ✅ Valid: Import from package subpath with valid classes
// @utilityFunctions [{"name": "styles", "from": "my-library"}]
// @validClasses [flex, flex-col, gap-2]
</script>

<template>
  <div :class="styles('flex', 'flex-col', 'gap-2')">Subpath import matches parent package</div>
</template>
