
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { db } from '../firebase/firebase';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { UserCursors } from '../utils/UserCursors';

const COLORS = ['#d72631', '#1b998b', '#2d3047', '#ffca3a', '#1982c4', '#6a0572', '#f46036'];

function assignColor(username: string) {
  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return COLORS[sum % COLORS.length];
}

const roomId = 'main-room';

const Editor: React.FC = () => {
  const { username } = useUser();
  const [cursors, setCursors] = useState<any>(null);
console.log(cursors);

  const editor = useEditor({
    extensions: [StarterKit, UserCursors],
    editorProps: {
    attributes: {
      class: 'focus-none',
      style: 'outline:none;box-shadow:none;border:none;',
    },
  },
    content: '',
    onUpdate: ({ editor }) => {
      if (!username) return;
      const json = editor.getJSON();
      const selection = editor.state.selection;

      if (editor.isFocused) {
        updateDoc(doc(db, 'documents', roomId), {
          content: json,
          lastEditedBy: username,
          timestamp: serverTimestamp(),
          [`cursors.${username}`]: {
            from: selection.from,
            to: selection.to,
            color: assignColor(username),
            username,
          },
        }).catch(async () => {
          await setDoc(doc(db, 'documents', roomId), {
            content: json,
            cursors: {
              [username]: {
                from: selection.from,
                to: selection.to,
                color: assignColor(username),
                username,
              },
            },
            lastEditedBy: username,
            timestamp: serverTimestamp(),
          });
        });
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    const docRef = doc(db, 'documents', roomId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      const content = data.content;
      const lastEditedBy = data.lastEditedBy;
      const cursorsFromDB = data.cursors || {};

      if (lastEditedBy !== username) {
        if (JSON.stringify(content) !== JSON.stringify(editor.getJSON())) {
          editor.commands.setContent(content);
        }
      }

      setCursors(cursorsFromDB);
      editor.commands.setCursors(cursorsFromDB);
    });

    return () => unsubscribe();
  }, [editor, username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a252f] via-[#34495e] to-[#0d7d49] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-6 text-black">
        <h2 className="mb-4 font-bold text-xl text-gray-800">
          Logged in as: <span className="text-green-600">{username}</span>
        </h2>
        <EditorContent editor={editor} style={{
    outline: 'none',
    boxShadow: 'none',
    border: 'none',
  }} className=" border border-gray-300 rounded p-4 min-h-[200px]" />
      </div>
    </div>
  );
};

export default Editor;
