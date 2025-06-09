// import { Plugin, PluginKey } from 'prosemirror-state';
// import { Decoration, DecorationSet } from 'prosemirror-view';
// import { Extension } from '@tiptap/core';

// export const UserCursors = Extension.create({
//   name: 'userCursors',

//   addOptions() {
//     return {
//       cursors: {},
//     };
//   },

//   addProseMirrorPlugins() {
//     return [
//       new Plugin({
//         key: new PluginKey('userCursors'),

//         state: {
//           init: () => DecorationSet.empty,
//           apply: (tr, old) => {
//             const meta = tr.getMeta('userCursors');
//             if (meta) {
//               const decorations: Decoration[] = [];

//               Object.entries(meta).forEach(([userId, cursor]) => {
//                 console.log(userId);
                
//                 const { from, to, color, username } = cursor as any;

//                 const cursorDecoration = Decoration.inline(from, to, {
//                   style: `background-color: ${color}33; border-bottom: 2px solid ${color};`,
//                 });

//                 const labelDecoration = Decoration.widget(to, () => {
//                   const label = document.createElement('span');
//                   label.textContent = username;
//                   label.style.background = color;
//                   label.style.color = 'white';
//                   label.style.fontSize = '12px';
//                   label.style.padding = '2px 4px';
//                   label.style.borderRadius = '4px';
//                   label.style.position = 'absolute';
//                   label.style.transform = 'translateY(-1.5em)';
//                   label.style.zIndex = '10';
//                   return label;
//                 }, { side: 1 });

//                 decorations.push(cursorDecoration, labelDecoration);
//               });

//               return DecorationSet.create(tr.doc, decorations);
//             }

//             return old.map(tr.mapping, tr.doc);
//           },
//         },

//         props: {
//           decorations(state) {
//             return this.getState(state);
//           },
//         },
//       }),
//     ];
//   },

//   addCommands() {
//     return {
//       setCursors: (cursors) => ({ tr, dispatch }) => {
//         tr.setMeta('userCursors', cursors);
//         if (dispatch) dispatch(tr);
//         return true;
//       },
//     };
//   },
// });
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Extension } from '@tiptap/core';
import type { RawCommands } from '@tiptap/core';
interface CursorData {
  from: number;
  to: number;
  color: string;
  username: string;
}

interface CursorMap {
  [userId: string]: CursorData;
}

export const UserCursors = Extension.create({
  name: 'userCursors',

  addOptions() {
    return {
      cursors: {} as CursorMap,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('userCursors'),

        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const meta = tr.getMeta('userCursors') as CursorMap | undefined;
            if (meta) {
              const decorations: Decoration[] = [];

              Object.entries(meta).forEach(([_, cursor]) => {
                const { from, to, color, username } = cursor;

                const cursorDecoration = Decoration.inline(from, to, {
                  style: `background-color: ${color}33; border-bottom: 2px solid ${color};`,
                });

                const labelDecoration = Decoration.widget(to, () => {
                  const label = document.createElement('span');
                  label.textContent = username;
                  label.style.background = color;
                  label.style.color = 'white';
                  label.style.fontSize = '12px';
                  label.style.padding = '2px 4px';
                  label.style.borderRadius = '4px';
                  label.style.position = 'absolute';
                  label.style.transform = 'translateY(-1.5em)';
                  label.style.zIndex = '10';
                  return label;
                }, { side: 1 });

                decorations.push(cursorDecoration, labelDecoration);
              });

              return DecorationSet.create(tr.doc, decorations);
            }

            return old.map(tr.mapping, tr.doc);
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      setCursors:
        (cursors: CursorMap) =>
        ({ tr, dispatch }: { tr: any; dispatch?: (tr: any) => void }) => {
          tr.setMeta('userCursors', cursors);
          if (dispatch) dispatch(tr);
          return true;
        },
    } as Partial<RawCommands>;
  },
});
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    userCursors: {
      setCursors: (cursors: any) => ReturnType;
    };
  }
}