import { CiImageOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";

function UploadImg() {
  return (
    <section className="w-full flex flex-row items-center gap-6 ">
      <div className="w-28 h-28 bg-[#222222] rounded-lg border border-[#495057] flex justify-center items-center">
        <i className=" ">
          <CiImageOn />
        </i>
      </div>

      <button className="ctaBtn py-2 px-4 flex flex-row gap-2">
        <i className="w-3.5 h-3.5">
          <MdOutlineFileUpload />
        </i>
        <span className="text-white text-sm font-normal leading-4 tracking-tight">
          Upload file
        </span>
      </button>
    </section>
  );
}

export default UploadImg;
