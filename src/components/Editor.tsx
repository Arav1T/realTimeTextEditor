// import React, { useRef } from 'react';
// import { useUser } from '../context/UserContext';
// import { useFirestoreSync } from '../hooks/useFirestoreSync';

// const ROOM_ID = 'main-room';

// const Editor: React.FC = () => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const { username } = useUser();
//   const { handleInput, lastEditedBy } = useFirestoreSync(ROOM_ID, editorRef, username);


//   return (
//     <div className="p-4 max-w-3xl mx-auto text-white">
//       <h2 className="text-lg mb-2 ">Logged in as: <strong>{username}</strong></h2>
//       {/* <div>hello</div> */}
//       <div className="relative">
//   {!editorRef.current?.innerText && (
//     <div className="absolute  p-4 pointer-events-none">
//       Start typing...
//     </div>
//   )}
//   <div
//     ref={editorRef}
//     contentEditable
//     suppressContentEditableWarning
//     onInput={handleInput}
//     className="bg-black border rounded shadow p-4 min-h-[200px] outline-none whitespace-pre-wrap"
//   />
// </div>

//       {lastEditedBy && (
//   <p className="mt-2 text-sm text-red-500">
//     Last edited by <strong>{lastEditedBy}</strong>
//   </p>
// )}

//     </div>
    
//   );
// };

// export default Editor;
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useFirestoreSync } from '../hooks/useFirestoreSync';

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { username } = useUser();
  const { handleInput, lastEditedBy, cursors } = useFirestoreSync('main-room', editorRef, username);
  const [caretPositions, setCaretPositions] = useState<{[user:string]: {top:number, left:number, color:string}} >({});


  function getCaretCoordinates(position: number) {
    if (!editorRef.current) return null;
    const range = document.createRange();
    const textNode = editorRef.current.firstChild;
    if (!textNode || textNode.nodeType !== 3) return null; // We expect text node only here
    const length = textNode.textContent?.length || 0;
    const pos = Math.min(position, length);

    range.setStart(textNode, pos);
    range.setEnd(textNode, pos);

    const rects = range.getClientRects();
    if (rects.length === 0) return null;
    const rect = rects[0];


    const editorRect = editorRef.current.getBoundingClientRect();

    return {
      top: rect.top - editorRect.top + editorRef.current.scrollTop,
      left: rect.left - editorRect.left + editorRef.current.scrollLeft,
    };
  }

  useEffect(() => {
    const newCaretPositions: {[user:string]: {top:number, left:number, color:string}} = {};
    if (!editorRef.current) return;
    Object.entries(cursors).forEach(([user, cursor]) => {
      if(user === username) return; // skip own cursor
      const coords = getCaretCoordinates(cursor.position);
      if (coords) {
        newCaretPositions[user] = { top: coords.top, left: coords.left, color: cursor.color };
      }
    });
    setCaretPositions(newCaretPositions);
  }, [cursors, username]);


  return (
    <div className="p-4 max-w-3xl mx-auto text-white relative">
      <h2 className="text-lg mb-2 ">
        Logged in as: <strong>{username}</strong>
      </h2>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="bg-black border rounded shadow p-4 min-h-[200px] outline-none whitespace-pre-wrap relative"
        spellCheck={false}
        style={{position:'relative'}}
      />


      {Object.entries(caretPositions).map(([user, pos]) => (
        <div
          key={user}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            height: '20px',
            width: '2px',
            backgroundColor: pos.color,
            pointerEvents: 'none',
            zIndex: 10,
            
          }}
        >

          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: 0,
              backgroundColor: pos.color,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              color: 'white',
            }}
          >
            {user}
          </div>
        </div>
      ))}

      {lastEditedBy && (
        <p className="mt-2 text-sm text-red-500">
          Last edited by <strong>{lastEditedBy}</strong>
        </p>
      )}
    </div>
  );
};

export default Editor;
