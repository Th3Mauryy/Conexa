$file = "C:\Users\maury\OneDrive\Escritorio\original residencia\conexa\src\pages\UserProfile.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

# 1. Agregar import de toast
if ($content -notmatch "import.*toast.*react-toastify") {
    $content = $content -replace "(import { useNavigate } from 'react-router-dom';)", "`$1`r`nimport { toast } from 'react-toastify';"
}

# 2. Encontrar y reemplazar handlePhotoChange
$pattern = "(?s)const handlePhotoChange = async.*?\r?\n    \};"
$replacement = @'
const handlePhotoChange = async (e) => {
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
    };
'@

$content = $content -replace $pattern, $replacement

Set-Content -Path $file -Value $content -NoNewline -Encoding UTF8
Write-Host "Archivo actualizado"
