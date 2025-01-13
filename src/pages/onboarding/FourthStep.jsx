import { IconUpload } from "@tabler/icons-react";
import React, { useState } from "react";

const FourthStep = ({ onImageUpload }) => {
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
      <div className="mb-20 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 text-center">Upload KTP/ID Card</h2>
        <div className="mt-4">
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-400">Tarik dan lepas foto KTP/ID Card di sini</span>
            )}

            <label htmlFor="file-upload" className="flex justify-center mt-4 absolute bottom-0 translate-y-5">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-600 transition duration-200">
                <IconUpload className="text-white" size={24} />
              </div>
            </label>
          </div>
        </div>
        <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
    </>
  );
};

export default FourthStep;
