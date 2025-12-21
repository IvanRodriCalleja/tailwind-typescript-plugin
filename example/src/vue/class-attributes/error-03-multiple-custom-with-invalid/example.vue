<script setup lang="ts">
// Error: Invalid classes in multiple custom attributes
// @invalidClasses [bad-color, bad-text]
</script>

<template>
  <View colorStyles="bg-blue-500 bad-color" textStyles="font-bold bad-text">
  			Hello
  		</View>
</template>
