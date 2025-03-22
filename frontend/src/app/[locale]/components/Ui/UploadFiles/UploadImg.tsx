'use client'

import React, { useRef } from "react";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";

function UploadImg() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log("Selected files:", files);
    }
  };

  return (
    <section className="w-full flex flex-row items-center gap-6">
      <div className="w-28 h-28 bg-[#222222] rounded-lg border border-[#495057] flex justify-center items-center">
        <i>
          <CiImageOn />
        </i>
      </div>

      <div>
        <button
          type="button"
          className="ctaBtn py-2 px-4 flex flex-row gap-2"
          onClick={handleClick}
        >
          <i className="w-3.5 h-3.5">
            <MdOutlineFileUpload />
          </i>
          <span className="text-white text-sm font-normal leading-4 tracking-tight">
            Upload file
          </span>
        </button>
        <input
          type="file"
          accept="image/*" 
          style={{ display: "none" }} 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}

export default UploadImg;
