<script setup lang="ts">
import classNames from 'classnames';

// ✅ Valid: Array in classNames() function
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="classNames(['flex', 'items-center', 'justify-center'])">
  			Array in classNames()
  		</div>
</template>
