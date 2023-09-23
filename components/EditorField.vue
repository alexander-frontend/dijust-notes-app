<script lang="ts" setup>
import MarkdownIt from 'markdown-it';
const {
  rawText,
  notes,
  parsedText,
  currentNoteId,
  activeNoteIndex,
  searchQuery,
} = storeToRefs(useStore());
const { setNotesData } = useStore();

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

const updateNote = () => {
  const { indexedDBHelper } = useMdNotes();

  // check if note already exists
  const note: Note = notes.value.find(
    (note: Note) => note.id === currentNoteId.value
  )!;

  const noteObj: Note = {
    id: '',
    title: splitRawText(rawText.value)[0],
    first_line: splitRawText(rawText.value)[1],
    content: rawText.value,
    created: new Date().toISOString(),
  };

  if (note) {
    noteObj.id = note.id;

    indexedDBHelper()
      .open()
      .then(
        () => {
          indexedDBHelper()
            .updateNote(noteObj)
            .then(
              () => {},
              (err) => {
                alert(err);
              }
            );
        },
        (err) => {
          alert(err);
        }
      );
  } else {
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
              () => {},
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

  indexedDBHelper()
    .open()
    .then(
      () => {
        indexedDBHelper()
          .getAllNotes()
          .then(
            (data: any) => {
              if (data && data.length > 0) {
                activeNoteIndex.value = 0;
                setNotesData(data, noteObj.id);
                searchQuery.value = '';
              }
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

const parseMarkdown = (text: string) => {
  return md.render(text);
};

const splitRawText = (text: string) => {
  return text.split('\n').filter((n) => n);
};

const editor__field = ref<HTMLTextAreaElement>(null!);

const focusEditor = () => {
  nextTick(() => {
    if (editor__field.value) {
      editor__field.value.focus();
    }
  });
};

defineExpose({ focusEditor });

watch(
  () => rawText.value,
  () => {
    parsedText.value = parseMarkdown(rawText.value);
  }
);
</script>

<template>
  <textarea
    class="editor__field weight-500"
    @input="updateNote()"
    v-model="rawText"
    ref="editor__field"
    @toggle-editor="focusEditor()"
  ></textarea>
</template>

<style lang="scss" scoped>
.editor {
}
</style>
