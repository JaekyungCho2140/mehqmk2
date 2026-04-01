import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

export function createExtensions() {
  return [
    StarterKit.configure({
      heading: false,
      bulletList: false,
      orderedList: false,
      blockquote: false,
      codeBlock: false,
      code: false,
      horizontalRule: false,
      strike: false,
      // Bold, Italic, History 활성화
    }),
    Underline,
    Placeholder.configure({
      placeholder: '번역을 입력하세요...',
    }),
  ];
}
