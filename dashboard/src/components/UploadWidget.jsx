import { useEffect, useRef } from "react";

const UploadWidget = ({ onUploadSuccess }) => {
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
          onUploadSuccess({
            public_id: result.info.public_id,
            secure_url: result.info.secure_url,
            original_filename: result.info.original_filename || "Untitled",
          });
        }
      },
    );
  }, [onUploadSuccess]);

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
