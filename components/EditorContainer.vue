<script lang="ts" setup>
const { isEditorEnabled, currentNoteCreated, activeNoteIndex, searchQuery } =
  storeToRefs(useStore());
const { setNotesData } = useStore();

const formatDateFully = (date: string) => {
  const dateTime: Date = new Date(date);

  return dateTime.toLocaleTimeString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  });
};

const editor_field = ref<null | { focusEditor: () => null }>(null);

const toggleEditor = () => {
  isEditorEnabled.value = !isEditorEnabled.value;
  editor_field.value?.focusEditor();
};

const searchNotes = (e: Event) => {
  const { indexedDBHelper } = useMdNotes();

  indexedDBHelper()
    .open()
    .then(
      () => {
        indexedDBHelper()
          .getAllNotes()
          .then(
            (data: any) => {
              let notesToShow = data,
                textToSearch = (e.target as HTMLInputElement).value;

              if (!textToSearch) {
                setNotesData(data);

                return;
              }

              textToSearch = textToSearch.trim().toLowerCase();

              notesToShow = notesToShow.filter((item: Note) => {
                if (item.content.toLowerCase().indexOf(textToSearch) !== -1)
                  return item;
              });

              activeNoteIndex.value = 0;
              setNotesData(notesToShow);
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
};

const isSearchActive = ref(false);
</script>

<template>
  <div class="note-editor d-flex flex-column">
    <div class="editor d-flex flex-column">
      <div class="top d-flex">
        <button class="edit-btn" @click="toggleEditor">
          <IconsNote :is-editor-enabled="isEditorEnabled" />
        </button>
        <div
          class="search-btn d-flex align-items-center"
          :class="{ active: isSearchActive == true }"
        >
          <IconsSearch />
          <input
            type="text"
            class="weight-500"
            placeholder="Search"
            @input="(e) => searchNotes(e)"
            @focus="isSearchActive = true"
            @blur="isSearchActive = false"
            v-model="searchQuery"
          />
        </div>
      </div>
      <div class="date">
        <template v-if="currentNoteCreated">
          {{ formatDateFully(currentNoteCreated) }}
        </template>
      </div>
      <EditorField v-show="isEditorEnabled" ref="editor_field" />
      <EditorPreview v-show="!isEditorEnabled" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.note-editor {
  .top {
    justify-content: space-between;
    .edit-btn {
      padding-top: 0.6rem;
      color: $color-light-cyan-blue;
      fill: $color-light-cyan-blue;
    }
    .search-btn {
      width: 26rem;
      padding: 0.6rem 0;
      border: 1px solid $color-light-gray-shade;
      border-radius: 8px;
      color: $color-light-cyan-blue;
      fill: $color-light-cyan-blue;
      transition: box-shadow 0.3s ease-out;
      @media (max-width: 768px) {
        width: 13rem;
      }
      &.active {
        box-shadow: 0 0 1rem 0.5rem rgba(221, 221, 221, 1);
      }
      input {
        width: 100%;
        border: 0;
        outline: 0;
        font-size: 1.4rem;
      }

      svg {
        margin: 0 0.5rem 0 0.8rem;
      }
    }
  }

  .editor {
    flex: 1;
    overflow-x: hidden;
    padding: 1.4rem 1.6rem;
    &__field {
      flex: 1;
      overflow: auto;
      border: none;
      outline: none;
      resize: none;
      font-size: 1.4rem;
      &:focus,
      &:active {
        outline: none;
        border: none;
        padding: 0;
      }
    }

    .date {
      padding: 1rem 0;
      min-height: 4.4rem;
      color: $color-light-cyan-blue;
      text-align: center;
      @media (max-width: 480px) {
        font-size: 1.4rem;
      }
    }
  }
}
</style>
