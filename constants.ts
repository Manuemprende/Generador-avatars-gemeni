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

**Producto en el Smartphone:**
- Dispositivo: Smartphone moderno (negro o gris oscuro) con pantalla vibrante.
- Descripción del producto a mostrar: La pantalla del teléfono debe mostrar de forma clara y dominante una interfaz o resultado relacionado con el siguiente producto: "${productDescription}". En todas las ${numberOfImages} imágenes, la pantalla debe ser el elemento central.

**Descripción de las ${numberOfImages} Imágenes (Variaciones Sugeridas):**

1.  **Plano Medio (Presentación de Producto):** ${pronoun.article} ${profession} mirando directamente a la cámara, sonriendo. Sostiene el smartphone a la altura del pecho, mostrando claramente la pantalla con el producto. ${pronoun.possessive} otra mano hace un gesto de invitación hacia la pantalla.

2.  **Plano Cercano (Interacción):** Enfocado en las manos interactuando con la pantalla táctil del teléfono. La pantalla muestra explícitamente la funcionalidad clave del producto. El rostro es visible pero secundario en el fondo.

3.  **Plano Americano (Contexto y Confianza):** ${pronoun.article} ${profession} de pie o sentado, con el cuerpo ligeramente girado pero haciendo contacto visual con la cámara. Sostiene el teléfono mostrando el producto.

4.  **Toma Dinámica (Uso en Movimiento):** ${pronoun.article} ${profession} caminando por su lugar de trabajo, revisando la app/producto. La pose sugiere que el producto es útil en el día a día. La pantalla muestra diferentes facetas o resultados del producto.

5.  **Plano General (Potencial Creativo):** ${pronoun.article} ${profession} en su escritorio o área de trabajo, interactuando con el producto. Se ve más del entorno. La pantalla del smartphone muestra claramente el producto, transmitiendo su versatilidad y poder.

(Nota: Si se solicitan menos de 5 imágenes, utiliza las primeras descripciones de la lista.)`;
};