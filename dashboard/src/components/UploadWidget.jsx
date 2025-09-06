import { useEffect, useRef } from "react";

const UploadWidget = () => {
  const cloudinaryRef = useRef(null);
  const widgetRef = useRef(null);
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    console.log(cloudinaryRef.current);
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (result.event === "success") {
          console.log("Image uploaded", result.info);
        }
      },
    );
  }, []);
  return (
    <button
      id="upload-widget"
      className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      onClick={() => {
        widgetRef.current.open();
      }}
    >
      Upload Image
    </button>
  );
};

export default UploadWidget;
