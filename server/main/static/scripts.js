var targetCategory = 'airplane';
var getPredictionTimeout;
var getPredictionTimeoutDelay = 1000;
var getNextCategoryDelay = 1000;

//// Canvas Attributes & Methods
const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
let lastX, lastY;
let mousePressed = false;

setTimeout(() => { // Due to other browser compatibility
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
}, 500);

function mouseDown (event) {
    mousePressed = true;
}

function mouseUp (event) {
    clearTimeout(getPredictionTimeout);
    mousePressed = false;
    getPredictionTimeout = setTimeout(getPrediction, getPredictionTimeoutDelay);
}

function mouseMove(event) {
    if (mousePressed) {
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
    lastX = event.offsetX;
    lastY = event.offsetY;
}

function clearCanvas() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getImage() {
    // Get Image Data
    let image1D = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Convert to Binary
    let binary1D = [];
    for (let i = 3; i < image1D.length; i += 4) {
        let isWhite = image1D[i] == 0;
        
        if (isWhite) binary1D.push(0);
        else         binary1D.push(1);
    }

    // Convert to Binary 2D
    let binary2D = [];
    for (let h = 0; h < canvas.height; h++) {
        let from = h * canvas.width;
        let to = (h + 1) * canvas.width;
        let row = binary1D.slice(from, to);
        binary2D.push(row);
    }

    //// Crop
    let topHeight = 0;
    let bottomHeight = canvas.height - 1;
    let leftWidth = 0;
    let rightWidth = canvas.width - 1;
    // Top & Bottom
    for (let h = 0; h < canvas.height; h++) {
        let row = binary2D[h];
        if (row.includes(1)) {
            topHeight = h;
            break;
        }
    }
    for (let h = canvas.height - 1; h >= 0; h--) {
        let row = binary2D[h];
        if (row.includes(1)) {
            bottomHeight = h;
            break;
        }
    }

    // Left & Right
    for (let w = 0; w < canvas.width; w++) {
        let col = binary2D.map(row => row[w])
        if (col.includes(1)) {
            leftWidth = w;
            break;
        }
    }
    for (let w = canvas.width - 1; w >= 0; w--) {
        let col = binary2D.map(row => row[w])
        if (col.includes(1)) {
            rightWidth = w;
            break;
        }
    }

    // Cropped Image (Binary 2D)
    let crop = [];
    for (let h = topHeight; h < bottomHeight + 1; h++) {
        let row = binary2D[h].slice(leftWidth, rightWidth + 1);
        crop.push(row);
    }

    return crop;
}

//// Get Categories
let categories = [];
fetch('/categories', {
    'method': 'POST',
    'headers': {'Content-type': 'application/json'}
}).then(res => res.json()).then(data => {
    categories = data['categories'];
});

//// Get Predictions
function getPrediction() {
    let image = getImage()
    fetch(
        '/predict', {
            'method': 'POST',
            'headers': { 'Content-type': 'application/json' },
            'body': JSON.stringify({
                'image': image
            })
        }
    ).then(res => res.json()).then(data => {
        let predictions = data['predictions'];
        let maxIndex = predictions.indexOf(Math.max(...predictions));
        let predictedCategory = categories[maxIndex]
        changeFooter(predictedCategory);
        if (targetCategory == predictedCategory) {
            displaySuccess();
            setTimeout(getNextCategory, getNextCategoryDelay);
        }
    });
}

//// Header & Footer
const header = document.getElementById('my-header');
const footer = document.getElementById('my-footer');

let headerStringsFmtFuncs = [
    category => `Try drawing ${category}`,
    category => `Draw ${category}.`,
    category => `How about ${category}?`,
    category => `Can you draw ${category}?`,
    category => `Maybe ${category}?`
];
let footerStringsFmtFuncs = [
    category => `I see ${category}`,
    category => `It looks like ${category}`,
    category => `Seems like ${category}`,
    category => `Is it ${category}?`
];
let emptyStrings = [
    'I see nothing.',
    'Nothing here.',
    'Empty.'
];
let successStrings = [
    'Woo sweet.',
    'Nice one!',
    'Excellent!',
    'Great Job!'
];

function changeHeader(category) {
    text = randomChoice(headerStringsFmtFuncs)(category);
    header.innerText = text;
}
function changeFooter(category) {
    text = randomChoice(footerStringsFmtFuncs)(category);
    footer.innerText = text;
}
function clearFooter() {
    text = randomChoice(emptyStrings);
    footer.innerText = text;
}
function displaySuccess() {
    text = randomChoice(successStrings);
    header.innerText = text;
}

//// Game Interactivity
function getNextCategory() {
    targetCategory = randomChoice(categories);
    changeHeader(targetCategory);
    resetCanvas();
}

function resetCanvas() {
    clearCanvas();
    clearFooter();
    clearTimeout(getPredictionTimeout);
}

//// For Mobile Devices
canvas.addEventListener("touchstart", touchDown);
canvas.addEventListener("touchend", touchUp);
canvas.addEventListener("touchmove", touchMove);

function touchDown(event) {
    let rect = event.target.getBoundingClientRect();
    let touchX = event.targetTouches[0].pageX - rect.left;
    let touchY = event.targetTouches[0].pageY - rect.top;
    lastX = touchX;
    lastY = touchY;
    mousePressed = true;
}

function touchUp(event) {
    clearTimeout(getPredictionTimeout);
    mousePressed = false;
    getPredictionTimeout = setTimeout(getPrediction, getPredictionTimeoutDelay);
}

function touchMove(event) {
    let rect = event.target.getBoundingClientRect();
    let touchX = event.targetTouches[0].pageX - rect.left;
    let touchY = event.targetTouches[0].pageY - rect.top;
    if (mousePressed) {
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(touchX, touchY);
        ctx.stroke();
    }
    lastX = touchX;
    lastY = touchY;
}

function touchCoord(event) {
    return touchX, touchY;
}

//// Misc
function randomChoice(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}