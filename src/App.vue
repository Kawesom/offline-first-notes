<template>
  <div class="flex w-screen h-screen text-gray-500">
    <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
      <!--Sidebar-->
    </div>

    <div class="flex flex-col flex-grow">
      <!--Main Content-->
      <div class="flex flex-col flex-grow overflow-auto">
      <editor-content :editor="editor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onMounted, ref } from 'vue'

const datab = ref(null)

const getDatabase = async () => {
  return new Promise((resolve, reject) => {
    let db = window.indexedDB.open("notes") //defaults window.indexedDB.open("notes",1) 

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
      up.target.result.createObjectStore('notes_table')
    };

  })
}

onMounted(async () => {
  datab.value = await getDatabase();
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