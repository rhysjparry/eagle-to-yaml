import yaml from 'https://cdn.jsdelivr.net/npm/yaml@2.4.2/+esm';

eagle.onPluginRun(async () => {
    const folders = await eagle.folder.getAll();
    const items = await eagle.item.getAll();

    const { output, errors } = getFolders(folders, items);

    displayYamlOutput(output);
    displayErrors(errors);
    setupButtons(output);
});

function getFolders(folders, items) {
    const output = {};
    const errors = [];

    folders.forEach(folder => {
        output[folder.name] = [];
        if (folder.children.length === 0) {
            errors.push(`Warning: Parent folder '${folder.name}' has no child folders.`);
        }

        folder.children.forEach(child => {
            const images = getImageData(child, items, folder.name, errors);
            output[folder.name].push({
                defaultStyle: child.description || 'basic',
                images
            });
        });
    });

    return { output, errors };
}

function getImageData(child, items, parentFolderName, errors) {
    const images = items
        .filter(item => item.folders.includes(child.id))
        .map(item => ({
            name: item.name,
            ext: item.ext,
            url: item.url,
            width: item.width,
            height: item.height,
            dominantColor: rgbToHex(item.palettes[0].color)
        }));

    if (images.length < 6) {
        errors.push(`Warning: Child folder '${parentFolderName}-${child.name}' has less than 6 images.`);
    }

    images.sort((a, b) => {
        const aSuffix = parseInt(a.name.match(/(\d+)$/)[0], 10);
        const bSuffix = parseInt(b.name.match(/(\d+)$/)[0], 10);
        return aSuffix - bSuffix;
    });

    const sortedImages = {};
    images.forEach((image, index) => {
        sortedImages[index + 1] = {
            url: `${image.url}/${image.name}.${image.ext}`,
            thumb: `${image.url}/${image.name}-thumb.${image.ext}`,
            width: image.width,
            height: image.height,
            dominantColor: image.dominantColor
        };
    });

    return sortedImages;
}

function displayYamlOutput(output) {
    const yamlOutput = yaml.stringify(output, { singleQuote: true, indent: 4 });
    const contentElement = document.getElementById('content');
    contentElement.textContent = yamlOutput;
}

function displayErrors(errors) {
    const errorElement = document.querySelector('.errors');
    if (errors.length > 0) {
        errorElement.classList.add('error');
        errorElement.innerHTML = `<pre id="error">${errors.join('\n')}</pre>`;
    } else if (errorElement) {
        errorElement.classList.remove('error');
        errorElement.innerHTML = '';
    }
}

function setupButtons(output) {
    const yamlOutput = yaml.stringify(output, { singleQuote: true, indent: 4 });

    document.getElementById('refresh').addEventListener('click', () => window.location.reload());
    document.getElementById('copy').addEventListener('click', () => eagle.clipboard.writeText(yamlOutput));
    document.getElementById('download').addEventListener('click', () => {
        const yamlBlob = new Blob([yamlOutput], { type: 'text/yaml;charset=utf-8' });
        downloadFile(yamlBlob, 'image_sets.yml');
    });
}

function downloadFile(blob, fileName) {
    const downloadButton = document.createElement('a');
    downloadButton.href = window.URL.createObjectURL(blob);
    downloadButton.download = fileName;
    document.body.appendChild(downloadButton);
    downloadButton.click();
    document.body.removeChild(downloadButton);
}

function rgbToHex([r, g, b]) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
