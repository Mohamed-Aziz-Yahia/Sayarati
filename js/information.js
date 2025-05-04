document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('preview-image');
    const uploadContent = document.querySelector('.upload-content');
    if (file.size > 10 * 1024 * 1024) { // 10MB
    alert('File too large! Max 10MB allowed');
    return;
}
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            uploadContent.classList.add('hidden');
        }
        
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.classList.add('hidden');
        uploadContent.classList.remove('hidden');
    }
});