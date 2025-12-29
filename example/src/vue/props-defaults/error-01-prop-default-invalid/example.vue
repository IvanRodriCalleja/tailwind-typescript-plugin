<script setup lang="ts">
// ❌ Invalid: Props with default class value containing invalid class
// @invalidClasses [invalid-prop-default]

// Using withDefaults with defineProps to set default class values
const props = withDefaults(defineProps<{
  buttonClass?: string;
}>(), {
  buttonClass: 'flex items-center invalid-prop-default'
});
</script>

<template>
  <button :class="props.buttonClass">Button with default class</button>
</template>
