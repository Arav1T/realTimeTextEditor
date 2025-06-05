import React, { useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useFirestoreSync } from '../hooks/useFirestoreSync';

const ROOM_ID = 'main-room';

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { username } = useUser();
  const { handleInput, lastEditedBy } = useFirestoreSync(ROOM_ID, editorRef, username);


  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <h2 className="text-lg mb-2 ">Logged in as: <strong>{username}</strong></h2>
      {/* <div>hello</div> */}
      <div className="relative">
  {!editorRef.current?.innerText && (
    <div className="absolute  p-4 pointer-events-none">
      Start typing...
    </div>
  )}
  <div
    ref={editorRef}
    contentEditable
    suppressContentEditableWarning
    onInput={handleInput}
    className="bg-black border rounded shadow p-4 min-h-[200px] outline-none whitespace-pre-wrap"
  />
</div>

      {lastEditedBy && (
  <p className="mt-2 text-sm text-red-500">
    Last edited by <strong>{lastEditedBy}</strong>
  </p>
)}

    </div>
    
  );
};

export default Editor;
