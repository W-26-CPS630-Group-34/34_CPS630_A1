// loading funtions
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
    // Step 1: Load the game screen

    // Step 2: wait for a response

    // Step 3: On response, provide an answer and clear the dom

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