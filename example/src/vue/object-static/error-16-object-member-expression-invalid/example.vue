<script setup lang="ts">
import * as utils from 'clsx';

const isActive = true;

// ❌ Invalid: Member expression with invalid in object
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="utils.clsx({ flex: true, 'invalid-class': true, 'items-center': isActive })">
  			Member invalid
  		</div>
</template>
