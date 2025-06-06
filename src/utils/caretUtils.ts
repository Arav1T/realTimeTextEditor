export function getCaretCharacterOffsetWithin(element: HTMLElement | null): number {
  let caretOffset = 0;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && element) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
}

export function setCaretPosition(element: HTMLElement | null, offset: number) {
  if (!element || !element.firstChild) return;

  const range = document.createRange();
  const selection = window.getSelection();

let currentNode: ChildNode | null = element.firstChild;

  while (currentNode && offset > 0) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      const textLength = currentNode.textContent?.length || 0;
      if (offset <= textLength) {
        break;
      }
      offset -= textLength;
    }
    currentNode = currentNode.nextSibling;
  }

  if (!currentNode) {
  
    currentNode = element;
    offset = 0;
  }

  if (selection) {
    range.setStart(currentNode, offset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
