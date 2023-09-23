import { defineStore } from 'pinia';

export const useStore = defineStore('main', () => {
  const isLoaded = ref(false);
  const isEditorEnabled = ref(false);
  const activeNoteIndex = ref(0);
  const rawText = ref('');
  const parsedText = ref('');
  const notes = ref<Note[]>([]);
  const currentNoteId = ref('');
  const currentNoteCreated = ref('');
  const searchQuery = ref('');

  const setCurrentNote = (id: string) => {
    const note = notes.value.find((note) => note.id === id);

    if (note) {
      currentNoteId.value = note.id;
      currentNoteCreated.value = note.created;
      rawText.value = note.content;
    }
  };

  const setNotesData = (data: Note[], id?: string) => {
    data.sort(
      (a: Note, b: Note) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
    );

    notes.value = data;

    if (notes.value.length == 0) {
      rawText.value = '';
      currentNoteCreated.value = '';

      return;
    }

    const newId =
      id || (notes.value.length > 0 && notes.value[activeNoteIndex.value].id);

    if (newId) setCurrentNote(newId);
  };

  return {
    isEditorEnabled,
    isLoaded,
    rawText,
    parsedText,
    notes,
    currentNoteId,
    activeNoteIndex,
    currentNoteCreated,
    setCurrentNote,
    setNotesData,
    searchQuery,
  };
});
