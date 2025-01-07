import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageUploader = ({ imgSelected, setImgSelected, url }) => {
  const [uploadedImages, setUploadedImages] = useState([]);

  // Cargar imágenes existentes desde el backend
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${url}/imagesuploaded`);
      setUploadedImages(response.data.images); // Suponiendo que devuelve un array de rutas
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
    }
  };

  useEffect(() => {
    fetchImages(); // Llamar cuando el componente se monte
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Leer el archivo como Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // Obtener solo la parte Base64
      const extension = file.name.split(".").pop(); // Obtener la extensión del archivo

      try {
        const response = await axios.post(`${url}/upload`, {
          image: base64Image,
          extension,
        });

        setUploadedImages((prev) => [...prev, response.data.filePath]);
      } catch (error) {
        console.error("Error subiendo la imagen:", error);
      }
    };
    reader.readAsDataURL(file); // Leer como Data URL
  };

  useEffect(() => {
    if (imgSelected) {
      console.log("Imagen Seleccionada:", imgSelected);
    }
  }, [imgSelected]);

  return (
    <div className="w-full">
      <h2 className="text-[#F5F5F5] text-xl font-medium">Subir Imágenes</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mt-4 w-full text-white"
      />
      <div style={{ marginTop: "20px" }}>
        <h3 className="text-[#F5F5F5] text-lg font-medium">
          Imágenes Subidas:
        </h3>
        <div className="w-full grid grid-cols-3 gap-2 p-2 mt-2">
          {uploadedImages.map((image, index) => {
            const imageSrc = `${url}${image}`;
            return (
              <img
                key={index}
                src={`${url}${image}`}
                className={`w-full h-20 cursor-pointer object-contain hover:bg-white hover:bg-opacity-35 ${
                  imgSelected === imageSrc ? "bg-blue-500 bg-opacity-35" : ""
                }`}
                onClick={() => {
                    if (imgSelected !== imageSrc) {
                      setImgSelected(imageSrc); // Solo actualiza si la imagen es diferente
                    }
                  }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
