import React, { useRef, useState } from "react";
import Cropper from "cropperjs";

const ImageCropper = ({ image }) => {
  const imageRef = useRef(null);
  const cropperInstance = useRef(null);
  const [croppedImage, setCroppedImage] = useState(null);

  React.useEffect(() => {
    if (imageRef.current) {
      cropperInstance.current = new Cropper(imageRef.current, {
        aspectRatio: NaN, // Poți schimba raportul de aspect
        viewMode: 1,
        autoCropArea: 0.8,
      });
    }

    return () => {
      if (cropperInstance.current) {
        cropperInstance.current.destroy();
      }
    };
  }, []);

  const handleCrop = () => {
    if (cropperInstance.current) {
      const canvas = cropperInstance.current.getCroppedCanvas();
      setCroppedImage(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div>
      <div>
        <img ref={imageRef} src={image} alt="To Crop" style={{ maxWidth: "100%" }} />
      </div>
      <button onClick={handleCrop}>Crop Image</button>
      {croppedImage && (
        <div>
          <h3>Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
