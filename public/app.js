// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileDimensions = document.getElementById('fileDimensions');
const removeBtn = document.getElementById('removeBtn');
const generateBtn = document.getElementById('generateBtn');
const status = document.getElementById('status');
const statusText = document.getElementById('statusText');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const iosCheck = document.getElementById('iosCheck');
const androidCheck = document.getElementById('androidCheck');

let selectedFile = null;
let downloadUrl = null;

// Dropzone click to open file picker
dropzone.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// Drag and drop handlers
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Handle file selection
function handleFile(file) {
    selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
            fileDimensions.textContent = `${img.width} × ${img.height} px`;

            // Warn if image is too small
            if (img.width < 1024 || img.height < 1024) {
                fileDimensions.innerHTML += ' <span style="color: #f59e0b;">⚠️ Recommended: 1024×1024 or larger</span>';
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    // Show preview, hide dropzone
    dropzone.classList.add('hidden');
    preview.classList.remove('hidden');
    generateBtn.disabled = false;
}

// Remove file
removeBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    preview.classList.add('hidden');
    dropzone.classList.remove('hidden');
    generateBtn.disabled = true;
    result.classList.add('hidden');
});

// Generate icons
generateBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    // Validate at least one platform is selected
    if (!iosCheck.checked && !androidCheck.checked) {
        alert('Please select at least one platform');
        return;
    }

    // Prepare platforms
    const platforms = [];
    if (iosCheck.checked) platforms.push('ios');
    if (androidCheck.checked) platforms.push('android');

    // Show loading status
    generateBtn.disabled = true;
    status.classList.remove('hidden');
    result.classList.add('hidden');
    statusText.textContent = 'Uploading and generating icons...';

    try {
        // Create form data
        const formData = new FormData();
        formData.append('icon', selectedFile);
        formData.append('platforms', platforms.join(','));

        // Upload and generate
        const response = await fetch('/api/generate', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate icons');
        }

        // Success
        downloadUrl = data.downloadUrl;
        showSuccess(platforms);

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        generateBtn.disabled = false;
    } finally {
        status.classList.add('hidden');
    }
});

// Show success
function showSuccess(platforms) {
    let platformText = platforms.map(p => p.toUpperCase()).join(' and ');
    resultText.textContent = `Your ${platformText} icons are ready to download!`;
    result.classList.remove('hidden');
}

// Download icons
downloadBtn.addEventListener('click', () => {
    if (downloadUrl) {
        window.location.href = downloadUrl;
    }
});

// Reset
resetBtn.addEventListener('click', () => {
    selectedFile = null;
    downloadUrl = null;
    fileInput.value = '';
    preview.classList.add('hidden');
    dropzone.classList.remove('hidden');
    result.classList.add('hidden');
    generateBtn.disabled = true;
    iosCheck.checked = true;
    androidCheck.checked = true;
});

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
