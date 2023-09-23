<script lang="ts" setup>
const { notes, isLoaded, activeNoteIndex, isEditorEnabled } = storeToRefs(
  useStore()
);
const { setCurrentNote } = useStore();

const formatDateShort = (date: string) => {
  const dateTime = new Date(date);

  return dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const toggleActiveNote = (value: number) => (activeNoteIndex.value = value);
</script>

<template>
  <template v-if="isLoaded">
    <div v-if="notes && notes.length > 0" class="notes d-flex flex-column">
      <div
        v-for="(note, i) in notes"
        class="note d-flex"
        :class="{ active: i === activeNoteIndex }"
        @click="
          toggleActiveNote(i);
          setCurrentNote(note.id);
          isEditorEnabled = false;
        "
      >
        <div class="text-content text-overflow-ellipsis">
          <div class="note-header">
            <p class="weight-700 text-overflow-ellipsis">
              <template v-if="note.title">
                {{ note.title }}
              </template>
              <template v-else> New Note </template>
            </p>
          </div>
          <div class="note-body d-flex">
            <span class="note-body__time weight-500">{{
              formatDateShort(note.created)
            }}</span>
            <span class="note-body__text weight-500 text-overflow-ellipsis">
              <template v-if="note.first_line">
                {{ note.first_line }}
              </template>
              <template v-else> No additional text </template>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-notes">No Notes</div>
  </template>
  <loader v-else />
</template>

<style lang="scss" scoped>
.notes {
  .note {
    position: relative;
    padding: 2.2rem;
    border-radius: 8px;
    font-size: 1.6rem;
    cursor: pointer;
    transition: background-color 0.3s ease-out;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 86%;
      transform: translate(-50%, 0);
      left: 50%;
      background: $color-light-gray-shade;
      height: 1px;
    }

    &:last-child::after {
      display: none;
    }

    @media (max-width: 480px) {
      padding: 0.8rem;
      font-size: 1.4rem;
    }

    &.active {
      background-color: $color-red-orange-shade;
    }

    &-body {
      &__time {
        margin-right: 0.8rem;
      }

      &__text {
        color: $color-light-cyan-blue;
      }
    }
  }

  @media (max-width: 480px) {
    display: none;
  }
}

.no-notes {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: $color-light-cyan-blue;
  font-size: 2.6rem;
  text-align: center;
  @media (max-width: 480px) {
    display: none;
  }
}

.nav-bar.opened {
  .notes {
    display: flex;
  }

  .no-notes {
    display: block;
  }
}
</style>
