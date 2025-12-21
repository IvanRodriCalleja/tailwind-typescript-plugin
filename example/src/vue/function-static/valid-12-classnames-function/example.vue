<script setup lang="ts">
import classNames from 'classnames';

// ✅ Valid: Using classNames() function
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="classNames('flex', 'items-center', 'justify-center')">
  			Using classNames function
  		</div>
</template>
