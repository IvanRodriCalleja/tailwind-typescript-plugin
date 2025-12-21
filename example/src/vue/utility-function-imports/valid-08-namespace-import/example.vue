<script setup lang="ts">
import * as utils from 'clsx';

// ✅ Valid: Namespace import with member expression
// @utilityFunctions [{"name": "clsx", "from": "clsx"}]
// @validClasses [flex, items-center, gap-4]
</script>

<template>
  <div :class="utils.clsx('flex', 'items-center', 'gap-4')">
  			Namespace import with member expression
  		</div>
</template>
