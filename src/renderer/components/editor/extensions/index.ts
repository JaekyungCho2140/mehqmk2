import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export function createExtensions() {
  return [
    StarterKit.configure({
      // Sprint 3-5에서 서식(B/I/U) 활성화 시 여기서 설정
      // 현재는 기본 텍스트 + history만 사용
      heading: false,
      bulletList: false,
      orderedList: false,
      blockquote: false,
      codeBlock: false,
      code: false,
      horizontalRule: false,
      strike: false,
      bold: false,
      italic: false,
    }),
    Placeholder.configure({
      placeholder: '번역을 입력하세요...',
    }),
  ];
}
