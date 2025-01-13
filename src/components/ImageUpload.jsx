import React from "react";
import { IconCamera } from "@tabler/icons-react";

const ImageUpload = ({ setSelectedImage }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="profile-pic-upload" />
      <label htmlFor="profile-pic-upload" className="cursor-pointer">
        <div className="relative">
          <img src="/image/avatar.png" alt="Profile" className="w-36 h-36 rounded-full border-4 border-white shadow-md" />
          <div className="absolute bottom-0 right-2 p-2 rounded-full bg-indigo-500 text-white">
            <IconCamera size={24} />
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;
