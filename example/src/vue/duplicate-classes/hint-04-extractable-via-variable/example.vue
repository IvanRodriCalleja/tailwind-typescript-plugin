<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const conditionalStyle = isActive ? 'flex bg-blue-500' : 'flex bg-gray-500';

// 💡 Hint: Variable ternary with 'flex' in both branches (extractable)
// @extractableClasses [flex, flex]
// No root 'flex', but variable contains ternary with 'flex' in both branches.
// Suggests extracting 'flex' outside the conditional in the variable definition.
</script>

<template>
  <div :class="clsx('mt-4', conditionalStyle)">Extractable via variable with ternary</div>
</template>
