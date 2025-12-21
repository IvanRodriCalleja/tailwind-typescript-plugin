<script setup lang="ts">
import classNames from 'classnames';

// ❌ Invalid: Using classNames() function with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="classNames('flex', 'invalid-class', 'items-center')">
  			Using classNames with invalid
  		</div>
</template>
