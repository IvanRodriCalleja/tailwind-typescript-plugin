<script setup lang="ts">
import { classnames as cx } from '@/utils/classnames';

// ✅ Valid: Aliased import from the correct package with valid classes
// @utilityFunctions [{"name": "cx", "from": "@/utils/classnames"}]
// @validClasses [bg-blue-500, text-white, rounded]
</script>

<template>
  <div :class="cx('bg-blue-500', 'text-white', 'rounded')">Aliased import</div>
</template>
