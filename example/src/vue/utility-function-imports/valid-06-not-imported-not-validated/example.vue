<script setup lang="ts">
import { merge } from '@/different/package';

// ✅ Valid: Function not imported from specified package is NOT validated (ignored)
// This tests that when a function has the right name but wrong import, it's skipped
// @utilityFunctions [{"name": "merge", "from": "some-other-package"}]
// @validClasses []
</script>

<template>
  <div :class="merge('flex', 'invalid-class-here')">Wrong import source - not validated</div>
</template>
