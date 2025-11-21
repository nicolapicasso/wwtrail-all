// components/RichTextEditor.tsx - TipTap WYSIWYG editor

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useRef, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { uploadFile } from '@/lib/api/files.service';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ImageIcon,
  Upload,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escribe tu contenido aquí...',
  className = '',
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-green-600 hover:text-green-700 underline',
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            'data-size': {
              default: 'full',
              parseHTML: (element) => element.getAttribute('data-size'),
              renderHTML: (attributes) => {
                return {
                  'data-size': attributes['data-size'],
                };
              },
            },
          };
        },
      }).configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg cursor-pointer',
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      setIsImageSelected(editor.isActive('image'));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImageFromUrl = () => {
    const url = window.prompt('Introduce la URL de la imagen:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const uploadImageFile = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'file');
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }
      uploadImageFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Introduce la URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const setImageWidth = (size: 'small' | 'medium' | 'large' | 'full') => {
    if (!editor.isActive('image')) {
      console.log('No image selected');
      return;
    }

    console.log('Resizing image to size:', size);

    // Actualizar el atributo data-size de la imagen seleccionada
    editor.chain().focus().updateAttributes('image', { 'data-size': size }).run();
  };

  return (
    <>
      {/* Estilos para los tamaños de imagen */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ProseMirror img[data-size="small"] {
            width: 33.333333% !important;
            height: auto !important;
          }
          .ProseMirror img[data-size="medium"] {
            width: 50% !important;
            height: auto !important;
          }
          .ProseMirror img[data-size="large"] {
            width: 75% !important;
            height: auto !important;
          }
          .ProseMirror img[data-size="full"] {
            width: 100% !important;
            height: auto !important;
          }
        `
      }} />

      <div className={`border rounded-lg bg-white ${className}`}>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text Style Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
          title="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('underline') ? 'bg-gray-300' : ''
          }`}
          title="Subrayado"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
          }`}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
          }`}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
          }`}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
          }`}
          title="Alinear a la izquierda"
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
          }`}
          title="Centrar"
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
          }`}
          title="Alinear a la derecha"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('link') ? 'bg-gray-300' : ''
          }`}
          title="Añadir enlace"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        {/* Image Upload */}
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={isUploading}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Subir imagen"
        >
          {isUploading ? (
            <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </button>

        {/* Image from URL */}
        <button
          type="button"
          onClick={addImageFromUrl}
          className="p-2 rounded hover:bg-gray-200"
          title="Añadir imagen desde URL"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Image Size Controls */}
        {isImageSelected && (
          <>
            <button
              type="button"
              onClick={() => setImageWidth('small')}
              className="px-2 py-1 text-xs rounded hover:bg-gray-200 bg-blue-50 font-semibold"
              title="Pequeño (33%)"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => setImageWidth('medium')}
              className="px-2 py-1 text-xs rounded hover:bg-gray-200 bg-blue-50 font-semibold"
              title="Mediano (50%)"
            >
              M
            </button>
            <button
              type="button"
              onClick={() => setImageWidth('large')}
              className="px-2 py-1 text-xs rounded hover:bg-gray-200 bg-blue-50 font-semibold"
              title="Grande (75%)"
            >
              L
            </button>
            <button
              type="button"
              onClick={() => setImageWidth('full')}
              className="px-2 py-1 text-xs rounded hover:bg-gray-200 bg-blue-50 font-semibold"
              title="Ancho completo (100%)"
            >
              XL
            </button>

            <div className="w-px h-8 bg-gray-300 mx-1" />
          </>
        )}

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-30"
          title="Deshacer"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-30"
          title="Rehacer"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
      </div>
    </>
  );
}
