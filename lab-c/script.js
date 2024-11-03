const map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

const marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

let correctOrder = [];
let placedCount = 0;

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error generating map image:", err);
            return;
        }
        createPuzzlePieces(canvas);
    });
});

function createPuzzlePieces(canvas) {
    const targetContainer = document.getElementById('targetContainer');
    const pieceWidth = targetContainer.clientWidth / 4;
    const pieceHeight = targetContainer.clientHeight / 4;
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';

    let pieces = [];

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const ctx = pieceCanvas.getContext('2d');
            ctx.drawImage(canvas, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
            pieces.push({ image: pieceCanvas.toDataURL(), position: { x, y } });
        }
    }

    pieces = shuffleArray(pieces);
    correctOrder = pieces.map(piece => ({ x: piece.position.x, y: piece.position.y }));

    pieces.forEach((piece, index) => {
        const pieceDiv = document.createElement('div');
        pieceDiv.className = 'puzzle-piece';
        pieceDiv.draggable = true;
        pieceDiv.style.backgroundImage = `url(${piece.image})`;
        pieceDiv.style.width = `${pieceWidth}px`;
        pieceDiv.style.height = `${pieceHeight}px`;

        
        pieceDiv.dataset.position = `${piece.position.x},${piece.position.y}`;
        pieceDiv.addEventListener('dragstart', dragStart);
        puzzleContainer.appendChild(pieceDiv);
    });

    targetContainer.innerHTML = '';

    for (let i = 0; i < 16; i++) {
        const target = document.createElement('div');
        target.className = 'target';
        target.dataset.position = `${i % 4},${Math.floor(i / 4)}`; 
        target.addEventListener('dragover', dragOver);
        target.addEventListener('drop', drop);
        targetContainer.appendChild(target);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.position);
    e.target.style.opacity = 0.5;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const piecePosition = e.dataTransfer.getData('text/plain');
    const piece = document.querySelector(`.puzzle-piece[data-position='${piecePosition}']`);

    if (piece && e.target.classList.contains('target') && !e.target.hasChildNodes()) {
        
        e.target.appendChild(piece);
        piece.style.opacity = 1;

        placedCount++;
        console.log(`Piece placed. Current placed count: ${placedCount}`);

        if (placedCount === 16) {
            const isCorrect = checkOrder();
            console.log(`Order checked. Is correct: ${isCorrect}`);

            setTimeout(() => {
                if (isCorrect) {
                    alert('Gratulacje! Ułożyłeś puzzle!');
                } else {
                    alert('Złe ułożenie puzzli! Spróbuj ponownie.');
                    resetPuzzle();
                }
            }, 100); 
        }
    }
}

function checkOrder() {
    const targets = document.querySelectorAll('.target');
    let isCorrect = true;

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const targetPosition = target.dataset.position;
        const placedPiece = target.querySelector('.puzzle-piece');

        if (placedPiece) {
            const piecePosition = placedPiece.dataset.position;
           
            if (piecePosition !== targetPosition) {
                isCorrect = false;
                break;
            }
        } else {
            
            isCorrect = false;
            break;
        }
    }

    return isCorrect;
}

function resetPuzzle() {
    const targets = document.querySelectorAll('.target');
    targets.forEach(target => {
        target.innerHTML = ''; 
    });
    placedCount = 0;
    console.log('Puzzle reset. placedCount reset to 0.');
}

document.getElementById("getLocation").addEventListener("click", function() {
    if (!navigator.geolocation) {
        console.log("Brak wsparcia geolokalizacji.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setView([lat, lon], 18);
        marker.setLatLng([lat, lon]);
        marker.bindPopup("Twoja aktualna lokalizacja.").openPopup();
    }, error => {
        console.error("Błąd podczas pobierania lokalizacji:", error);
    });
});
