// import { useEffect, useState } from 'react';
// import { doc, onSnapshot, setDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebase';
// import { debounce } from '../utils/debounce';

// export const useFirestoreSync = (
//   roomId: string,
//   editorRef: React.RefObject<HTMLDivElement | null>,
//   username: string
// ) => {
//     const [lastEditedBy, setLastEditedBy] = useState<string>("");
//   useEffect(() => {
//     const docRef = doc(db, 'documents', roomId);

//     const unsubscribe = onSnapshot(docRef, (docSnap) => {
//       const data = docSnap.data();
//       if (
//         editorRef?.current &&
//         data?.content !== editorRef.current.innerText
//       ) {
//         editorRef.current.innerText = data?.content || '';
//       }
//       if (data?.lastEditedBy) {
//         setLastEditedBy(data.lastEditedBy);
//       }
//     });

//     return () => unsubscribe();
//   }, [editorRef, roomId]);

//   const saveContent = debounce(async (text: string) => {
//     const docRef = doc(db, 'documents', roomId);
//     await setDoc(docRef, {
//       content: text,
//       lastEditedBy: username,
//       timestamp: Date.now(),
//     });
//   }, 400);

//   const handleInput = () => {
//     if (editorRef?.current) {
//       const text = editorRef.current.innerText;
//       saveContent(text);
//     }
//   };

//   return { handleInput, lastEditedBy };
// };
import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { debounce } from '../utils/debounce';
import { getCaretCharacterOffsetWithin, setCaretPosition } from '../utils/caretUtils';

interface CursorMap {
  [username: string]: { position: number; color: string };
}

const COLORS = [
  '#d1c3af',
  '#b3c5ca',
  '#e6d98f',
  '#cdb4c9',
  '#a9ccc8',
  '#e7b5b5',
  '#b5e7b5',
  '#c5c7d0',
  '#eecfb5',
  '#b5e7cc',
]



function assignColor(username: string) {
  let sum = 0;
  for (let i = 0; i < username.length; i++) sum += username.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

export const useFirestoreSync = (
  roomId: string,
  editorRef: React.RefObject<HTMLDivElement | null>,
  username: string
) => {
  const [lastEditedBy, setLastEditedBy] = useState<string>('');
  const [cursors, setCursors] = useState<CursorMap>({});

  useEffect(() => {
    const docRef = doc(db, 'documents', roomId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      const data = docSnap.data();

      if (
        editorRef?.current &&
        data?.content !== editorRef.current.innerText
      ) {
       
        if (data?.lastEditedBy !== username) {
          const selection = window.getSelection();
          const range = selection?.getRangeAt(0);
          const caretOffset = range ? getCaretCharacterOffsetWithin(editorRef.current) : null;

          editorRef.current.innerText = data?.content || '';

         
          if (caretOffset !== null) {
            setCaretPosition(editorRef.current, caretOffset);
          }
        }
      }

      if (data?.lastEditedBy) {
        setLastEditedBy(data.lastEditedBy);
      }

      if (data?.cursors) {
        setCursors(data.cursors);
      }
    });

    return () => unsubscribe();
  }, [editorRef, roomId, username]);

  const saveContent = debounce(async (text: string) => {
    const docRef = doc(db, 'documents', roomId);
    await updateDoc(docRef, {
      content: text,
      lastEditedBy: username,
      timestamp: Date.now(),
    });
  }, 400);

  const saveCursorPosition = debounce(async (position: number) => {
    const docRef = doc(db, 'documents', roomId);
    const color = assignColor(username);
    await updateDoc(docRef, {
      [`cursors.${username}`]: { position, color },
    });
  }, 200);

  const handleInput = () => {
    if (editorRef?.current) {
      const text = editorRef.current.innerText;
      saveContent(text);

      const pos = getCaretCharacterOffsetWithin(editorRef.current);
      saveCursorPosition(pos);
    }
  };

  useEffect(() => {
    const onSelectionChange = () => {
      if (editorRef?.current) {
        const pos = getCaretCharacterOffsetWithin(editorRef.current);
        saveCursorPosition(pos);
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [editorRef]);

  return { handleInput, lastEditedBy, cursors, username, updateCursor: saveCursorPosition };
};
