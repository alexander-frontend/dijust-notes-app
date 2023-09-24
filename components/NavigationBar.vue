<script lang="ts" setup>
const { notes, activeNoteIndex, currentNoteId, isEditorEnabled, searchQuery } =
  storeToRefs(useStore());
const { setNotesData } = useStore();

const isMenuOpened = ref(false);

const addNote = () => {
  const { indexedDBHelper } = useMdNotes();

  const noteObj: Note = {
    id: '',
    title: '',
    first_line: '',
    content: '',
    created: new Date().toISOString(),
  };

  noteObj.id = window.crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16);

  indexedDBHelper()
    .open()
    .then(
      () => {
        indexedDBHelper()
          .addNote(noteObj)
          .then(
            () => {
              indexedDBHelper()
                .getAllNotes()
                .then(
                  (data: any) => {
                    updateNotes(data, false, noteObj.id);
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
      },
      (err) => {
        alert(err);
      }
    );
};

const deleteNote = () => {
  if (confirm('Are you sure?') == true) {
    const { indexedDBHelper } = useMdNotes();

    notes.value = notes.value.filter((note: Note) => {
      return currentNoteId.value != note.id;
    });

    indexedDBHelper()
      .open()
      .then(
        () => {
          indexedDBHelper()
            .deleteNote(currentNoteId.value)
            .then(
              () => {
                updateNotes(notes.value, false);
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
  }
};

const updateNotes = (data: any, toggleEditor: boolean, id?: string) => {
  activeNoteIndex.value = 0;

  isEditorEnabled.value = toggleEditor;
  setNotesData(data, id);
};

onMounted(() => {
  window.addEventListener('orientationchange', () => {
    isMenuOpened.value = false;
  });
});
</script>

<template>
  <section class="nav-bar" :class="{ opened: isMenuOpened == true }">
    <div class="nav-bar__actions d-flex">
      <button class="add-btn weight-300" @click="addNote">+</button>
      <button
        class="delete-btn"
        @click="notes && notes.length > 0 && deleteNote()"
      >
        <IconsRemove />
      </button>
      <button
        class="menu-btn d-flex align-items-start"
        @click="isMenuOpened = !isMenuOpened"
      >
        <IconsMenu :variant="isMenuOpened ? 'closed' : 'opened'" />
      </button>
    </div>
    <Notes />
  </section>
</template>

<style lang="scss" scoped>
.nav-bar {
  position: relative;
  min-width: 34rem;
  width: 34rem;
  height: 100vh;
  overflow: auto;
  padding: 1.4rem;
  @media (max-width: 768px) {
    min-width: 0;
  }

  @media (max-width: 480px) {
    padding: 0.2rem 0.6rem 0 0.8rem;
    width: auto;
    background: $color-light-blue-shade;
    .nav-bar__actions {
      width: 100%;
      height: 100%;
      padding: 0.6rem 0.4rem 2.2rem 0;
      .add-btn,
      .delete-btn {
        display: none;
      }

      .add-btn {
        margin-right: 2rem;
      }

      .menu-btn {
        display: flex;
      }
    }
  }

  &__actions {
    padding: 1rem 0 2.2rem 2.4rem;
    line-height: 0;
    .add-btn {
      color: $color-light-cyan-blue;
      font-size: 3.2rem;
      margin-right: 3rem;
    }

    .delete-btn,
    .menu-btn {
      color: $color-light-cyan-blue;
      fill: $color-light-cyan-blue;
    }

    .menu-btn {
      color: $color-white;
      fill: $color-white;
      display: none;
    }
  }

  &.opened {
    background: initial;
    padding: 1.4rem 1rem;
    width: 26rem;
    animation: slideright 0.5s ease-in-out;
    .nav-bar__actions {
      width: initial;
      height: initial;
      padding-left: 1.2rem;
      .menu-btn {
        background-color: $color-light-cyan-blue;
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.4rem 0;
        color: $color-white;
        fill: $color-white;
        margin-right: 0;
      }
      .add-btn,
      .delete-btn {
        display: block;
      }
    }
  }
}

@keyframes slideright {
  0% {
    width: 6rem;
  }
  100% {
    width: 26rem;
  }
}
</style>
