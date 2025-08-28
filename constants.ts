interface PromptDetails {
  profession: string;
  gender: string;
  age: number;
  ethnicity: string;
  productDescription: string;
  numberOfImages: number;
}

const getPronoun = (gender: string) => {
    switch (gender.toLowerCase()) {
        case 'masculino': return { subject: 'él', possessive: 'su', article: 'el' };
        case 'femenino': return { subject: 'ella', possessive: 'su', article: 'la' };
        default: return { subject: 'la persona', possessive: 'su', article: 'el/la' };
    }
}

const getClothing = (profession: string) => {
    switch (profession.toLowerCase()) {
        case 'doctor':
        case 'médico':
        case 'doctora':
        case 'médica':
            return 'Bata de médico blanca inmaculada sobre un uniforme médico (scrubs) de color azul claro o camisa de vestir clara. Opcionalmente, un estetoscopio colgando del cuello o en el bolsillo.';
        case 'engineer':
        case 'ingeniero':
        case 'ingeniera':
            return 'Camisa de vestir casual o polo, pantalones formales y opcionalmente un casco de seguridad o planos en la mano.';
        case 'teacher':
        case 'profesor':
        case 'profesora':
            return 'Atuendo profesional pero accesible, como una camisa con cuello, un suéter o un blazer. Amigable y educativo.';
        default:
            return 'Vestimenta profesional y moderna que se alinee con su campo. La ropa debe ser pulcra y adecuada para un entorno de trabajo.';
    }
}


export const generateDynamicPrompt = ({
  profession,
  gender,
  age,
  ethnicity,
  productDescription,
  numberOfImages,
}: PromptDetails): string => {
  const pronoun = getPronoun(gender);
  const clothing = getClothing(profession);

  return `Genera un conjunto de ${numberOfImages} imágenes profesionales y atractivas de un influencer virtual (${profession}) que promocione un producto innovador. Las imágenes deben ser consistentes en personaje y entorno, pero variar en pose, ángulo de cámara e interacción.

**Personaje: Influencer Virtual Profesional**
- Identidad: ${profession}, ${gender}, aproximadamente ${age} años.
- Etnia: ${ethnicity}.
- Apariencia: Cabello moderno y bien peinado. Expresión facial amigable, profesional y confiada, con una sonrisa genuina.
- Vestimenta: ${clothing}

**Entorno:**
- Ubicación: Un entorno de trabajo moderno, limpio y luminoso relevante para su profesión (ej. oficina, clínica, estudio, taller).
- Iluminación: Luz suave y profesional tipo estudio, que evite sombras duras.
- Fondo: Ligeramente desenfocado (bokeh) para centrar la atención en el personaje y el producto.

**Producto a Promocionar:**
- Descripción del producto: El influencer sostiene y presenta de forma atractiva el siguiente producto: "${productDescription}". El producto debe ser el foco de atención, integrado de manera natural en las manos del influencer. Debe ser claramente visible en todas las imágenes.

**Descripción de las ${numberOfImages} Imágenes (Variaciones Sugeridas):**

1.  **Plano Medio (Presentación de Producto):** ${pronoun.article} ${profession} mirando directamente a la cámara, sonriendo. Sostiene el producto a la altura del pecho, mostrándolo claramente. ${pronoun.possessive} otra mano hace un gesto de invitación hacia el producto.

2.  **Plano Cercano (Interacción):** Enfocado en las manos interactuando con el producto. El producto se muestra en detalle, destacando sus características clave. El rostro del influencer es visible pero secundario en el fondo.

3.  **Plano Americano (Contexto y Confianza):** ${pronoun.article} ${profession} de pie o sentado, con el cuerpo ligeramente girado pero haciendo contacto visual con la cámara. Sostiene el producto de forma visible y profesional.

4.  **Toma Dinámica (Uso en Movimiento):** ${pronoun.article} ${profession} caminando por su lugar de trabajo, usando o mostrando el producto. La pose sugiere que el producto es útil en el día a día y se integra perfectamente en su entorno profesional.

5.  **Plano General (Potencial Creativo):** ${pronoun.article} ${profession} en su escritorio o área de trabajo, con el producto integrado en su rutina. Se ve más del entorno. El producto se muestra claramente, transmitiendo su versatilidad y poder.

(Nota: Si se solicitan menos de 5 imágenes, utiliza las primeras descripciones de la lista.)`;
};
