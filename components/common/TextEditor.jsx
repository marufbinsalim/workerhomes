import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditor({
  initialData,
  onChange,
  disabled,
  setTouched,
  error,
  ignoreMediaImport = false,
}) {
  const media = ignoreMediaImport ? ["link"] : ["link", "image", "video"];

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      media,
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="tw:relative tw:flex tw:flex-col tw:gap-2">
      <ReactQuill
        modules={modules}
        formats={formats}
        style={{
          maxHeight: "300px",
          height: "300px",
          borderRadius: "10px",
        }}
        theme="snow"
        value={initialData}
        onChange={onChange}
        onBlur={(r) => {
          if (r.index === 0) {
            onChange("");
            setTouched && setTouched({ [name]: true });
          }
        }}
        readOnly={disabled}
      />

      <p className="tw:text-[#b7b7b7]">{error}</p>
    </div>
  );
}
