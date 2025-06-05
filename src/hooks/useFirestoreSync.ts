import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { debounce } from '../utils/debounce';

export const useFirestoreSync = (
  roomId: string,
  editorRef: React.RefObject<HTMLDivElement> | null,
  username: string
) => {
    const [lastEditedBy, setLastEditedBy] = useState<string>("");
  useEffect(() => {
    const docRef = doc(db, 'documents', roomId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      const data = docSnap.data();
      if (
        editorRef?.current &&
        data?.content !== editorRef.current.innerText
      ) {
        editorRef.current.innerText = data?.content || '';
      }
      if (data?.lastEditedBy) {
        setLastEditedBy(data.lastEditedBy);
      }
    });

    return () => unsubscribe();
  }, [editorRef, roomId]);

  const saveContent = debounce(async (text: string) => {
    const docRef = doc(db, 'documents', roomId);
    await setDoc(docRef, {
      content: text,
      lastEditedBy: username,
      timestamp: Date.now(),
    });
  }, 400);

  const handleInput = () => {
    if (editorRef?.current) {
      const text = editorRef.current.innerText;
      saveContent(text);
    }
  };

  return { handleInput, lastEditedBy };
};
