<script setup lang="ts">
import * as utils from 'clsx';

// ❌ Invalid: Namespace import with invalid class
// @utilityFunctions [{"name": "clsx", "from": "clsx"}]
// @invalidClasses [not-valid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="utils.clsx('flex', 'items-center', 'not-valid-class')">
  			Namespace import with invalid class
  		</div>
</template>
