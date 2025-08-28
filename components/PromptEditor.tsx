import React, { useRef, useState, useEffect } from 'react';

interface Profile {
  name: string;
  profession: string;
  gender: string;
  age: number;
  ethnicity: string;
  productDescription: string;
}

interface PromptEditorProps {
  profession: string;
  setProfession: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  age: number;
  setAge: (value: number) => void;
  ethnicity: string;
  setEthnicity: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
  productImage: string | null;
  setProductImage: (value: string | null) => void;
  validationErrors: Record<string, boolean>;
}

const GENDERS = ['Masculino', 'Femenino', 'No binario'];
const LOCAL_STORAGE_KEY = 'virtualInfluencerProfiles';

export const PromptEditor: React.FC<PromptEditorProps> = ({
  profession, setProfession,
  gender, setGender,
  age, setAge,
  ethnicity, setEthnicity,
  productDescription, setProductDescription,
  productImage, setProductImage,
  validationErrors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [profileNameToSave, setProfileNameToSave] = useState<string>('');

  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProfiles) {
        setSavedProfiles(JSON.parse(storedProfiles));
      }
    } catch (error) {
      console.error("Error al cargar perfiles desde localStorage:", error);
    }
  }, []);

  const handleSaveProfile = () => {
    const name = profileNameToSave.trim();
    if (!name) {
      alert("Por favor, ingresa un nombre para el perfil.");
      return;
    }

    const newProfile: Profile = { name, profession, gender, age, ethnicity, productDescription };
    
    const existingIndex = savedProfiles.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    let updatedProfiles;

    if (existingIndex > -1) {
        if (confirm(`Un perfil con el nombre "${name}" ya existe. ¿Deseas sobrescribirlo?`)) {
            updatedProfiles = [...savedProfiles];
            updatedProfiles[existingIndex] = newProfile;
        } else {
            return;
        }
    } else {
        updatedProfiles = [...savedProfiles, newProfile];
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfiles));
    setSavedProfiles(updatedProfiles);
    setSelectedProfile(name); // Select the newly saved profile
    setProfileNameToSave(''); // Clear input after saving
    alert(`Perfil "${name}" guardado exitosamente.`);
  };

  const handleLoadProfile = (profileName: string) => {
    setSelectedProfile(profileName);
    if (!profileName) return;

    const profileToLoad = savedProfiles.find(p => p.name === profileName);
    if (profileToLoad) {
      setProfession(profileToLoad.profession);
      setGender(profileToLoad.gender);
      setAge(profileToLoad.age);
      setEthnicity(profileToLoad.ethnicity);
      setProductDescription(profileToLoad.productDescription);
      // Note: Product image is not saved/loaded
    }
  };

  const handleDeleteProfile = () => {
    if (!selectedProfile) {
      alert("Por favor, selecciona un perfil de la lista para eliminar.");
      return;
    }
    if (confirm(`¿Estás seguro de que quieres eliminar el perfil "${selectedProfile}"? Esta acción no se puede deshacer.`)) {
      const updatedProfiles = savedProfiles.filter(p => p.name !== selectedProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfiles));
      setSavedProfiles(updatedProfiles);
      setSelectedProfile(''); // Reset selection
      alert(`Perfil "${selectedProfile}" eliminado.`);
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
      setProductImage(null);
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-6 bg-gray-800/50 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-gray-200 border-b border-gray-700 pb-3 mb-2">
        Crea el Perfil de tu Influencer
      </h2>

      {/* Profile Management Section */}
      <div className="p-4 bg-gray-900/50 rounded-lg space-y-3">
          <h3 className="text-md font-semibold text-gray-300">Gestión de Perfiles</h3>
          <div className="flex flex-col sm:flex-row gap-3">
              <select
                  value={selectedProfile}
                  onChange={(e) => handleLoadProfile(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  aria-label="Cargar perfil guardado"
              >
                  <option value="">Cargar un perfil...</option>
                  {savedProfiles.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
              <button
                  onClick={handleDeleteProfile}
                  disabled={!selectedProfile || savedProfiles.length === 0}
                  className="px-4 py-2 bg-red-800 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition duration-300 text-sm"
              >
                  Eliminar
              </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={profileNameToSave}
              onChange={(e) => setProfileNameToSave(e.target.value)}
              placeholder="Nombre para guardar el perfil actual"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 transition duration-200"
              aria-label="Nombre para guardar el perfil"
            />
            <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white font-bold rounded-lg transition duration-300 text-sm whitespace-nowrap"
            >
                Guardar Perfil
            </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="profession" className="text-md font-semibold text-gray-300">
            Profesión
          </label>
          <input
            id="profession"
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className={`w-full p-3 bg-gray-700 border rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${validationErrors.profession ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Ej: Médico, Ingeniero, Artista"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="gender" className="text-md font-semibold text-gray-300">
            Género
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="age" className="text-md font-semibold text-gray-300">
            Edad
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            className={`w-full p-3 bg-gray-700 border rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${validationErrors.age ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Ej: 40"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="ethnicity" className="text-md font-semibold text-gray-300">
            Etnia
          </label>
          <input
            id="ethnicity"
            type="text"
            value={ethnicity}
            onChange={(e) => setEthnicity(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            placeholder="Ej: Caucásico, Hispano, Asiático"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="product-image-upload" className="text-md font-semibold text-gray-300">
          Imagen del Producto (Opcional)
        </label>
        <div className="mt-1 flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
          {productImage ? (
              <div className="relative group flex-shrink-0">
                  <img src={productImage} alt="Vista previa del producto" className="h-24 w-24 rounded-lg object-cover shadow-md" />
                  <button
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                      aria-label="Eliminar imagen"
                  >
                      &#x2715;
                  </button>
              </div>
          ) : (
              <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </div>
          )}
          <div className="flex-1">
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  id="product-image-upload"
              />
              <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                  {productImage ? 'Cambiar Imagen' : 'Añadir Imagen'}
              </button>
              <p className="text-xs text-gray-400 mt-2">
                  Sube una imagen para que la IA la incluya en la pantalla del smartphone.
              </p>
          </div>
        </div>
      </div>


      <div className="flex flex-col space-y-2">
        <label htmlFor="product-description" className="text-md font-semibold text-gray-300">
          Producto a Promocionar (Descripción)
        </label>
        <textarea
          id="product-description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          rows={3}
          className={`w-full p-3 bg-gray-700 border rounded-lg shadow-inner text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y ${validationErrors.productDescription ? 'border-red-500' : 'border-gray-600'}`}
          placeholder="Describe el producto o la aplicación que se mostrará en la pantalla del smartphone..."
        />
      </div>
    </div>
  );
};