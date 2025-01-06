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