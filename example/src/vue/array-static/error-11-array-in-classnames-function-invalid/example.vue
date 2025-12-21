<script setup lang="ts">
import classNames from 'classnames';

// ❌ Invalid: Array in classNames() with invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="classNames(['flex', 'invalid-class', 'items-center'])">
  			Array in classNames() invalid
  		</div>
</template>
