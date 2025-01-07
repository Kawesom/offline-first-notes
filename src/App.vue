<template>
  <div class="flex w-screen h-screen text-gray-500">
    <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
      <!--Sidebar-->
      <div class="h-0 overflow-auto flex-grow">
        <div class="flex items-center h-8 px-3 group mt-4">
          <div class="flex items-center flex-grow focus:outline-none">
            <a
              class="ml-2 leading-none font-medium text-sm"
              href="#"
              @click.prevent="showAllNotes"
            >All Notes</a>
          </div>
          <button @click="addNewNote">
            Add Note
          </button>
        </div>

        <div class="mt-4">
          <a
            class="flex items-center h-8 text-sm pl-8 pr-3"
            href="#"
            v-for="note in notes"
            :key="note.created"
            @click.prevent="openNote(note)"
          >
            <span class="ml-2 leading-none">{{ new Date(note.created).toLocaleString() }}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="flex flex-col flex-grow" v-if="Object.keys(activeNote).length">
      <!--Main Content - Editor-->
      <div class="flex flex-col flex-grow overflow-auto">
      <editor-content :editor="editor" />
      </div>

      <div class="h-16 bg-gray-100 border-t border-gray-300 text-right">
        <button @click="saveNote" class="bg-none border border-black rounded py-1 px-4 mr-4 mt-3 hover:bg-gray-900 justify-end">Save Note</button>
      </div>
      
    </div>

    <div class="flex flex-col flex-grow" v-else>
      <!--Main Content - Notes List-->
      <div class="flex flex-col flex-grow overflow-auto">
        <div v-for="note in notes" :key="note.created">
          <div class="flex px-4 pt-3 pb-4">
            <div class="prose my-2 mx-auto">
              <div>
                <span class="ml-1 text-xs text-gray-500">Created on {{ new Date(note.created).toLocaleString() }}</span>
              </div>
              <div v-html="note.content"></div>
            </div>
          </div>
          <hr class="w-full">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onMounted, ref } from 'vue'

const dataB = ref(null);
const notes = ref([]);
const activeNote = ref({});

const getDatabase = async () => {
  return new Promise((resolve, reject) => {
    let db = window.indexedDB.open("notes",2) //defaults window.indexedDB.open("notes",1) 

    db.onsuccess = (s) => {
      console.log('db.onsuccess',s);
      resolve(s.target.result);
    };

    db.onerror = (e) => {
      reject("Error opening the database.", e);
    };

    db.onupgradeneeded = (up) => { 
      //when requesting data from a version of the database that is higher than the one loaded into the site, but will fire if db does not exist yet
      console.log('db.onupgradeneeded',up);
      up.target.result.deleteObjectStore('notes_table')
      up.target.result.createObjectStore('notes_table', { keyPath: "created"})
    };

  })
}

onMounted(async () => {
  dataB.value = await getDatabase();
  let gotten_notes = await getNotes();
  notes.value = gotten_notes.reverse();
});

const editor = useEditor({
  content: "<h1>Start</h1>",
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose my-6 mx-auto focus:outline-none',
    },
  },
});

const saveNote = async () => {
  return new Promise((resolve,reject) => {
    let notesStore = dataB.value.transaction('notes_table','readwrite')
    .objectStore('notes_table');

    let noteRequest = notesStore.get(activeNote.value.created) //we used the created date as the unique incremental ID

    noteRequest.onerror = (e) => {
     reject("Error saving the note in the database:", e)
  }

    noteRequest.onsuccess = (s) => {
      let note = s.target.result;
      note.content = editor.value.getHTML();

      let updateRequest = notesStore.put(note);

      updateRequest.onerror = (e) => {
        reject("Error updating the requested note in the database.")
      };

      updateRequest.onsuccess = (s) => {
        //find note that's being edited then edit it in  the notes array shown in the sidebar
        let noteIndex = notes.value.findIndex(n => n.created === note.created);
        notes.value[noteIndex] = note;
        resolve();
      };
  }

  })
}

const getNotes = async () => {
  return new Promise((resolve, reject) => {
    dataB.value.transaction("notes_table") //read only
    .objectStore('notes_table')
    .getAll()
    .onsuccess = (s) => {
      console.log("getNotes():", s.target.result)
      resolve(s.target.result);
    }
  })
}

const openNote = (note) => {
  editor.value.commands.setContent(note.content);
  activeNote.value = note;
}

const showAllNotes = () => {
  //clear the editor
  editor.value.commands.clearContent();

  //set the activeNote as an empty object
  activeNote.value = {};

}

const addNewNote = () => {
  //add a blank note to the database
  return new Promise((resolve,reject) => {
    let transaction = dataB.value.transaction("notes_table","readwrite");

    transaction.oncomplete = (com) => {
      resolve();
    }

    let now = new Date();

    let note = {
      content: "",
      created: now.getTime()
    }

    //add that same note to the sidebar
    notes.value.unshift(note)

    //set the activeNote as the new note
    activeNote.value = note;
    transaction.objectStore('notes_table').add({note})
  })
  
}

</script>

<style>

.tiptap {
  max-width: 65ch;
  margin-top: 24px;
  margin-bottom: 24px;
  margin-left: auto;
  margin-right: auto;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

</style>