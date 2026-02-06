// loading functions
async function loadCrop(id) {
    try {
        const response = await fetch(`/api/crop/id/${id}`);
        const crop = await response.json();
        return crop;
    } catch (error) {
        console.error('Error loading level:', error);
        return '';
    }
}

async function loadAll() {
    try {
        const response = await fetch('/api/crop');
        const crops = await response.json();
        return crops;
    } catch (error) {
        console.error('Error loading levels:', error);
        return '';
    }
}

// initGame(crop)
function initGame(crop){
    const src = crop.src;
    const answer = crop.answer;
    const zoom = crop.zoom;
    const x = crop.x;
    const y = crop.y;

    let divH = document.querySelector('#heading');
    let divImg = document.querySelector('#image');
    let divInt = document.querySelector('#interact');

    // Step 1: Load the game screen
    divH.innerHTML = "<h1>WHAT IS THIS?</h1>";
    divImg.innerHTML = `<img src="${src}" height="100">`;
    img.style.transform = `scale(${zoom}) translate(${x}%, ${y}%)`;
    divInt.innerHTML = `
        <form id="guess-form">
            <input type="text" id="guess" required>
            <button type="submit">Guess!</button>
        </form>
        `;
    // Step 2: wait for a response
    document.querySelector('#guess-form').addEventListener('submit', async (e) => {
        e.preventDefault(); //prevent form submission
        img.style.transform = `translate(${-x}%, ${-y}%) scale(1)`;
        const article = (['a', 'e', 'i', 'o', 'u'].includes[answer[0]]) ? 'an' : 'a';
        divInt.innerHTML = `
        <h3>This is ${article} ${answer}</h3>
        <form id="next-form">
            <button type="submit">Next!</button>
        </form>
        `;
        const guess = document.querySelector('#guess').value;
        divH.innerHTML = (guess.trim().toLowerCase() == answer) ? "<h1>CORRECT!</h1>" : "<h1>INCORREC!T</h1>";
    });

    document.querySelector('#next-form').addEventListener('submit', async (e) => {
        e.preventDefault(); //prevent form submission
        divH.innerHTML = "";
        divImg.innerHTML = "";
        divInt.innerHTML = "";
    });
}


// Main Function Logic Starts Here!

const params = new URLSearchParams(window.location.search);
let range = params.get('range') || '';
let crops = [];

if (range == '') {
    const crops = loadAll();
    if (crops == '') {
        alert('Error loading all levels.');
    } else {
        crops.forEach(initGame);
    }
} else {
    range.split(",");
    let ids = []

    range.forEach(value => {
        value = value.trim()
        if (value.length == 1 && !ids.includes(value)) {
            ids.push(parseInt(value));
        } else {
            value.split("-");
            for (let i = parseInt(value[0]); i <= parseInt(value[1]); i++) {
                if (!ids.includes(value)) ids.push(parseInt(value));
            }
        }
    });

    ids.forEach(id => {
        const crop = loadCrop(id);
        if(crop == '') {
            alert('Error loading level, proceeding to the next screen.')
        } else {
            initGame(crop);
        }
    });

}

// when game is over, redirect back to root (index.html)
    document.querySelector('#heading').innerHTML = "<h1>THANKS FOR PLAYING!</h1>";
    document.querySelector('#image').innerHTML = "<h3>Click the button below to head back to the home page</h3>";
    document.querySelector('#interact').innerHTML = `<a href="/" class="btn">Home</a>`;