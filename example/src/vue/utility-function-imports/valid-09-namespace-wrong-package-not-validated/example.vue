<script setup lang="ts">
import * as utils from 'other-package';

// ✅ Valid: Namespace import from wrong package is NOT validated (ignored)
// @utilityFunctions [{"name": "clsx", "from": "clsx"}]
// @validClasses []
</script>

<template>
  <div :class="utils.clsx('flex', 'invalid-should-be-ignored')">
  			Wrong namespace import - not validated
  		</div>
</template>
