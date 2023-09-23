<script lang="ts" setup>
// import css
import '../../assets/editor_preview/styles.scss';
const { parsedText } = storeToRefs(useStore());
</script>

<template>
  <div class="editor__preview d-flex flex-column">
    <div class="editor__preview-area weight-500" v-html="parsedText"></div>
  </div>
</template>

<style lang="scss" scoped>
.editor__preview-area {
  color: $color-dark-cyan-blue;
  font-size: 1.4rem;
}
</style>
