import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function TextEditor({
  initialData,
  onChange,
  disabled,
  setTouched,
  error,
  ignoreMediaImport = false,
}) {
  const media = ignoreMediaImport ? ['link'] : ['link', 'image', 'video']

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      media,
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]

  return (
    <div>
      <ReactQuill
        modules={modules}
        formats={formats}
        style={{
          height: '300px',
          marginBottom: '40px',
          borderRadius: '5px',
        }}
        theme='snow'
        value={initialData}
        onChange={onChange}
        onBlur={r => {
          if (r.index === 0) {
            onChange('')
            setTouched && setTouched({ [name]: true })
          }
        }}
        readOnly={disabled}
      />
      {error && <span className='text-red-1 pt-10'>{error}</span>}
    </div>
  )
}
