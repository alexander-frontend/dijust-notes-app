export const useMdNotes = () => {
  let db: IDBDatabase;

  const indexedDBHelper = () => {
    let lastIndex = 0;
    const indexedDB =
      (<any>window).indexedDB ||
      (<any>window).mozIndexedDB ||
      (<any>window).webkitIndexedDB ||
      (<any>window).msIndexedDB ||
      (<any>window).shimIndexedDB;

    const open = () => {
      const promise = new Promise((resolve, reject) => {
        //Opening the DB
        const request = indexedDB.open('mdNotes', 1);

        //Handling onupgradeneeded
        //Will be called if the database is new or the version is modified
        request.onupgradeneeded = () => {
          const db = request.result;

          db.createObjectStore('mdNotes', { autoIncrement: true });

          //Deleting DB if already exists
          if (db.objectStoreNames.contains('mdNotes')) {
            db.deleteObjectStore('mdNotes');
          }

          //Creating a new DB store with a paecified key property
          db.createObjectStore('mdNotes', { keyPath: 'id' });
        };

        //If opening DB succeeds
        request.onsuccess = () => {
          db = request.result;
          //console.log(window.db);
          resolve(true);
        };

        //If DB couldn't be opened for some reason
        request.onerror = () => {
          reject("Couldn't open DB");
        };
      });

      return promise;
    };

    const addNote = (note: Note) => {
      //Wrapping logic inside a promise
      const promise = new Promise((resolve, reject) => {
        const trans = db.transaction(['mdNotes'], 'readwrite');
        const store = trans.objectStore('mdNotes');
        const request = store.add(note);

        //success callback
        request.onsuccess = () => {
          //Sending a request to add a note
          resolve(true);
        };

        //error callback
        request.onerror = (e) => {
          console.log(e);
          reject("Couldn't add the passed item");
        };
      });

      return promise;
    };

    const getAllNotes = () => {
      const notes: Note[] = [];

      //Creating a transaction object to perform Read/Write operations
      const trans = db.transaction('mdNotes', 'readwrite');

      //Getting a reference of the note store
      const store = trans.objectStore('mdNotes');

      //Wrapping all the logic inside a promise
      const promise = new Promise((resolve, reject) => {
        //Opening a cursor to fetch items from lower bound in the DB
        const keyRange = IDBKeyRange.lowerBound(0);
        const cursorRequest: IDBRequest = store.openCursor(keyRange);

        //success callback
        cursorRequest.onsuccess = (e) => {
          const result = cursorRequest.result;

          //Resolving the promise with note items when the result id empty
          if (result === null || result === undefined) {
            resolve(notes);
          }
          //Pushing result into the note list
          else {
            notes.push(result.value);

            if (result.value.id > lastIndex) {
              lastIndex = result.value.id;
            }

            result.continue();
          }
        };

        //Error callback
        cursorRequest.onerror = (e) => {
          reject("Couldn't fetch items from the DB");
        };
      });
      return promise;
    };

    const deleteNote = (id: string) => {
      const promise = new Promise((resolve, reject) => {
        const trans = db.transaction('mdNotes', 'readwrite');
        const store = trans.objectStore('mdNotes');
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (e) => {
          console.log(e);
          reject("Couldn't delete the item");
        };
      });

      return promise;
    };

    const updateNote = (note: Note) => {
      const promise = new Promise((resolve, reject) => {
        const trans = db.transaction('mdNotes', 'readwrite');
        const store = trans.objectStore('mdNotes');
        const request = store.put(note);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (e) => {
          console.log(e);
          reject("Couldn't update the item");
        };
      });

      return promise;
    };

    return {
      open: open,
      addNote: addNote,
      updateNote: updateNote,
      getAllNotes: getAllNotes,
      deleteNote: deleteNote,
    };
  };

  return { indexedDBHelper };
};
