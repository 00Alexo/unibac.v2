import React, { useState } from "react";
import ImageCropper from "../hooks/ImageCropper";

const Cropper = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {image && <ImageCropper image={image} />}
    </div>
  );
};

export default Cropper;
