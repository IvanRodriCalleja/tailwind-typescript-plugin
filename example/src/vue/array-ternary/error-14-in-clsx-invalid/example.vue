<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary in array with clsx() invalid
// @invalidClasses [invalid-active]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="clsx(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])">
  			Ternary in clsx invalid
  		</div>
</template>
