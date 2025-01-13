import { IconUpload } from "@tabler/icons-react";
import React, { useState } from "react";

const SixthStep = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };
  return (
    <>
      <h2 className="text-lg mt-8 font-semibold text-gray-800 text-center">Upload Profile Picture</h2>
      <div className="mt-6 flex justify-center">
        <div className="relative border-4 border-dashed border-gray-300 rounded-full w-52 h-52 flex items-center justify-center">
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-gray-400">Foto Profil</span>
          )}
          <label htmlFor="file-upload" className="flex justify-center mt-4 absolute -bottom-1 right-3 z-10">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition duration-200">
              <IconUpload className="text-white" size={24} />
            </div>
          </label>
        </div>
      </div>
      <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
    </>
  );
};

export default SixthStep;
