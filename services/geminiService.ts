import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("La variable de entorno API_KEY no está configurada");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Describes a product image using Gemini to generate a text description.
 * This description is then used in the image generation prompt.
 * @param base64ImageData The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to a string description of the image.
 */
export const describeImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    try {
        console.log("Describiendo imagen del producto...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: 'Describe esta imagen de producto en detalle para un prompt de generación de imágenes. Céntrate en los elementos visuales clave, el estilo, el color y lo que representa, para que otro modelo de IA pueda recrear la esencia de lo que se muestra en la pantalla de un smartphone.' },
                    { inlineData: { mimeType, data: base64ImageData } }
                ]
            }
        });
        console.log("Descripción de la imagen obtenida.");
        return response.text;
    } catch (error) {
        console.error("Error al describir la imagen:", error);
        throw new Error("No se pudo analizar la imagen del producto.");
    }
};

/**
 * Generates a specified number of images of a virtual influencer based on a prompt.
 * Handles API limits by making sequential calls for chunks of up to 4 images.
 * @param prompt The detailed prompt describing the character, environment, and image scenes.
 * @param aspectRatio The desired aspect ratio for the images (e.g., '1:1', '16:9').
 * @param numberOfImages The total number of images to generate.
 * @param isCancelledRef A mutable ref object to check for cancellation requests.
 * @returns A promise that resolves to an array of base64 encoded image strings.
 */
export const generateInfluencerImages = async (
  prompt: string, 
  aspectRatio: string, 
  numberOfImages: number,
  isCancelledRef: React.MutableRefObject<boolean>
): Promise<string[]> => {
  try {
    console.log(`Generando ${numberOfImages} imágenes con relación de aspecto: ${aspectRatio}...`);
    
    if (numberOfImages <= 0) {
      return [];
    }

    const baseRequest = {
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
    };

    const baseConfig = {
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio,
    };

    const allImages: any[] = []; 

    // The API supports up to 4 images per call.
    const maxImagesPerCall = 4;
    let remainingImages = numberOfImages;

    // Make sequential API calls in chunks to avoid rate limiting.
    while (remainingImages > 0) {
      if (isCancelledRef.current) {
        console.log('Generación cancelada por el usuario.');
        break;
      }
      const imagesInThisCall = Math.min(remainingImages, maxImagesPerCall);
      console.log(`Realizando llamada a la API para ${imagesInThisCall} imagen(es)...`);

      const response = await ai.models.generateImages({
        ...baseRequest,
        config: { ...baseConfig, numberOfImages: imagesInThisCall },
      });

      const generated = response.generatedImages || [];
      allImages.push(...generated);
      remainingImages -= imagesInThisCall;

      // If there are more images to generate, wait a bit before the next call.
      // This helps to avoid hitting API rate limits.
      if (remainingImages > 0 && !isCancelledRef.current) {
        console.log('Esperando antes de la siguiente llamada para evitar exceder los límites de la API.');
        await delay(1500); // Wait 1.5 seconds.
      }
    }
    
    if (isCancelledRef.current) {
        return []; // Return empty if cancelled
    }

    if (allImages.length === 0) {
      throw new Error("La API no devolvió ninguna imagen.");
    }
    
    if (allImages.length < numberOfImages) {
      console.warn(`La API devolvió menos imágenes de las solicitadas. Se obtuvieron ${allImages.length}, se esperaban ${numberOfImages}`);
    }

    const imageBytesArray = allImages.map(img => img.image.imageBytes);

    console.log(`Se generaron exitosamente ${imageBytesArray.length} imágenes.`);
    return imageBytesArray;
  } catch (error) {
    if (isCancelledRef.current) {
      console.log("Se suprimió el error debido a la cancelación.");
      return [];
    }
    console.error("Error al generar imágenes con la API de Gemini:", error);

    // Check for a specific quota error message
    if (error instanceof Error && (error.message.includes('429') || /RESOURCE_EXHAUSTED/i.test(error.message))) {
      throw new Error("Se excedió la cuota de la API. Por favor, revisa tu plan y detalles de facturación.");
    }

    throw new Error("No se pudo comunicar con el servicio de generación de imágenes.");
  }
};