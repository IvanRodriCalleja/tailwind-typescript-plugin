<script setup lang="ts">
import classNames from 'classnames';

const isActive = true;

// ✅ Valid: Ternary in classNames() function
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="classNames('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')">
  			Ternary in classNames()
  		</div>
</template>
