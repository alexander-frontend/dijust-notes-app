<script lang="ts" setup>
const { isLoaded } = storeToRefs(useStore());
const { setNotesData } = useStore();

// get all notes
onBeforeMount(() => {
  const { indexedDBHelper } = useMdNotes();

  indexedDBHelper()
    .open()
    .then(
      () => {
        indexedDBHelper()
          .getAllNotes()
          .then(
            (data: any) => {
              if (data && data.length > 0) {
                setNotesData(data);
              }

              isLoaded.value = true;
            },
            (err) => {
              alert(err);
            }
          );
      },
      (err) => {
        alert(err);
      }
    );
});
</script>

<template>
  <section class="main d-flex">
    <NavigationBar />
    <hr />
    <EditorContainer class="note-editor" />
  </section>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;

  .note-editor {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-bottom: 1rem;
  }

  hr {
    border: 0;
    width: 1px;
    background-color: $color-light-gray-shade;
  }
}
</style>
