<script setup lang="ts">
import classNames from 'classnames';

const isActive = true;

// ✅ Valid: Object in classNames() function
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="classNames({ flex: true, 'items-center': true, 'justify-center': isActive })">
  			Object in classNames()
  		</div>
</template>
