const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\maury\\OneDrive\\Escritorio\\original residencia\\conexa\\src\\pages\\UserProfile.jsx';

// Leer archivo
let content = fs.readFileSync(filePath, 'utf8');

// 1. Agregar import si no existe
if (!content.includes("import { toast } from 'react-toastify'")) {
    content = content.replace(
        "import { useNavigate } from 'react-router-dom';",
        "import { useNavigate } from 'react-router-dom';\nimport { toast } from 'react-toastify';"
    );
}

// 2. Reemplazar la función handlePhotoChange
const oldFunctionStart = 'const handlePhotoChange = async (e) => {';
const oldFunctionEnd = '    };';

// Encontrar el inicio de la función
const funcStart = content.indexOf(oldFunctionStart);
if (funcStart === -1) {
    console.error('No se encontró handlePhotoChange');
    process.exit(1);
}

// Encontrar el final de la función (el siguiente }; después del inicio)
let funcEnd = funcStart;
let braceCount = 0;
let foundStart = false;

for (let i = funcStart; i < content.length; i++) {
    if (content[i] === '{') {
        braceCount++;
        foundStart = true;
    } else if (content[i] === '}') {
        braceCount--;
        if (foundStart && braceCount === 0) {
            funcEnd = i + 2; // Incluir "};"
            break;
        }
    }
}

// Nueva función
const newFunction = `const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('⚠️ La imagen es muy pesada. Máximo 4MB');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formDataUpload = new FormData();
        formDataUpload.append('images', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/upload', formDataUpload, config);
            setFormData(prev => ({ ...prev, profilePhoto: data[0] }));
            toast.success('✅ Foto actualizada correctamente');
            setUploading(false);
        } catch (error) {
            console.error('Error uploading photo:', error);
            setPhotoPreview(null);
            if (error.response?.status === 413) {
                toast.error('⚠️ La imagen es muy pesada. Máximo 4MB');
            } else {
                toast.error('❌ Error al subir la foto. Intenta de nuevo');
            }
            setUploading(false);
            e.target.value = '';
        }
    };`;

// Reemplazar
content = content.substring(0, funcStart) + newFunction + content.substring(funcEnd);

// Guardar
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Archivo actualizado correctamente');
