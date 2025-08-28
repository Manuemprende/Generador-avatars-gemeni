import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { PromptEditor } from './components/PromptEditor';
import { ImageGallery } from './components/ImageGallery';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generateInfluencerImages, describeImage } from './services/geminiService';
import { generateDynamicPrompt } from './constants';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImageCountSelector } from './components/ImageCountSelector';

// Initial default values for the form state
const INITIAL_PROFESSION = 'Médico';
const INITIAL_GENDER = 'Masculino';
const INITIAL_AGE = 40;
const INITIAL_ETHNICITY = 'Caucásico';
const INITIAL_PRODUCT_DESCRIPTION = 'Una aplicación innovadora con capacidades de creación de avatares.';
const INITIAL_ASPECT_RATIO = '4:3';
const INITIAL_NUMBER_OF_IMAGES = 4;

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>(INITIAL_ASPECT_RATIO);
  const [numberOfImages, setNumberOfImages] = useState<number>(INITIAL_NUMBER_OF_IMAGES);

  // State for prompt builder
  const [profession, setProfession] = useState<string>(INITIAL_PROFESSION);
  const [gender, setGender] = useState<string>(INITIAL_GENDER);
  const [age, setAge] = useState<number>(INITIAL_AGE);
  const [ethnicity, setEthnicity] = useState<string>(INITIAL_ETHNICITY);
  const [productDescription, setProductDescription] = useState<string>(INITIAL_PRODUCT_DESCRIPTION);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const isCancelledRef = useRef<boolean>(false);

  const handleClearFields = () => {
    setProfession(INITIAL_PROFESSION);
    setGender(INITIAL_GENDER);
    setAge(INITIAL_AGE);
    setEthnicity(INITIAL_ETHNICITY);
    setProductDescription(INITIAL_PRODUCT_DESCRIPTION);
    setProductImage(null);
    setAspectRatio(INITIAL_ASPECT_RATIO);
    setNumberOfImages(INITIAL_NUMBER_OF_IMAGES);
    setImages([]);
    setError(null);
    setValidationErrors({});
  };

  const handleGenerateClick = useCallback(async () => {
    // Reset previous validation state
    setValidationErrors({});
    setError(null);

    // Perform validation
    const newErrors: Record<string, boolean> = {};
    if (profession.trim() === '') newErrors.profession = true;
    if (productDescription.trim() === '') newErrors.productDescription = true;
    if (!age || age <= 0) newErrors.age = true;

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError("Por favor, completa todos los campos obligatorios antes de generar.");
      return; // Stop if validation fails
    }


    isCancelledRef.current = false;
    setIsLoading(true);
    setImages([]);

    let finalProductDescription = productDescription;

    try {
      if (productImage) {
        // productImage is a data URL like "data:image/jpeg;base64,..."
        const mimeType = productImage.substring(productImage.indexOf(':') + 1, productImage.indexOf(';'));
        const base64Data = productImage.substring(productImage.indexOf(',') + 1);

        const imageDescription = await describeImage(base64Data, mimeType);
        finalProductDescription += `\n\nDescripción visual del producto a mostrar: ${imageDescription}`;
      }
      
      const prompt = generateDynamicPrompt({
        profession,
        gender,
        age,
        ethnicity,
        productDescription: finalProductDescription,
        numberOfImages,
      });

      const generatedImages = await generateInfluencerImages(prompt, aspectRatio, numberOfImages, isCancelledRef);
      
      if (isCancelledRef.current) {
        setError("La generación de imágenes fue cancelada.");
        setImages([]);
      } else {
        const imageUrls = generatedImages.map(base64 => `data:image/jpeg;base64,${base64}`);
        setImages(imageUrls);
      }
    } catch (err) {
      if (!isCancelledRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
        setError(`Error al generar las imágenes. ${errorMessage}`);
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    profession,
    gender,
    age,
    ethnicity,
    productDescription,
    productImage,
    aspectRatio,
    numberOfImages,
  ]);

  const handleCancelClick = () => {
    isCancelledRef.current = true;
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <PromptEditor
              profession={profession} setProfession={setProfession}
              gender={gender} setGender={setGender}
              age={age} setAge={setAge}
              ethnicity={ethnicity} setEthnicity={setEthnicity}
              productDescription={productDescription} setProductDescription={setProductDescription}
              productImage={productImage} setProductImage={setProductImage}
              validationErrors={validationErrors}
            />
            <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
            <ImageCountSelector value={numberOfImages} onChange={setNumberOfImages} />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                {isLoading ? 'Generando...' : `Generar`}
              </button>
              {isLoading ? (
                  <button
                      onClick={handleCancelClick}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                      Cancelar
                  </button>
              ) : (
                 <button
                    onClick={handleClearFields}
                    disabled={isLoading}
                    className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                    Limpiar
                  </button>
              )}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-2xl p-4 min-h-[500px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && <ImageGallery images={images} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;