(async function main() {
    changeBG();
    const params = new URLSearchParams(window.location.search);
    let range = params.get('range') || '';
    let listOfCrops = [];
    if (range != '') {
        range = range.split(",");
        let ids = []

        for(value of range) {
            value = value.trim();
            if (!value.includes("-")) {
                value = parseInt(value);
                if (!ids.includes(value)) ids.push(value);
            } else {
                value = value.split("-");
                for (let i = parseInt(value[0].trim()); i <= parseInt(value[1].trim()); i++) {
                    if (!ids.includes(i)) ids.push(i);
                }
            }
        }

        for(id of ids){
            const crop = await loadCrop(id);
            if (crop) listOfCrops.push(crop);
        }

    } else {
        const crops = await loadCrops();
        listOfCrops = crops;
    }


    if (listOfCrops.length == 0) {
        alert('No levels found, skipping to end of game');
    } else {
        listOfCrops.sort( () => Math.random()-0.5 );
        for (const crop of listOfCrops) {
            await initGame(crop); // waits for player to hit Next
        }
    }

    changeBG();
    document.getElementById('image').style.borderStyle = 'none';
    document.getElementById('image').style.height = 'fit-content';
    // when game is over, redirect back to root (index.html)
    document.querySelector('#heading').innerHTML = "<h1>THANKS FOR PLAYING!</h1>";
    document.querySelector('#image').innerHTML = "<h3>Click the button below to head back to the home page</h3>";
    document.querySelector('#interact').innerHTML = `<a href="/" class="btn" id="home">Home</a>`;
})();

async function loadCrops() {
    try {
        const response = await fetch('/api/crop');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error loading levels:', error);
    }
    return [];
}

async function loadCrop(id) {
    try {
        const response = await fetch(`/api/crop/id/${id}`);
        const result = await response.json();
        if (response.status === 404) {
            return false;
        }
        return result;
    } catch (error) {
        console.error('Error loading level:', error);
    }
    return false;
}


function initGame(crop) {
    return new Promise(resolve => {
        changeBG();
        const { id, src, answer, zoom, x, y } = crop;
        const divH = document.querySelector('#heading');
        const divImg = document.querySelector('#image');
        const divInt = document.querySelector('#interact');

        // Step 1: Game screen + user input
        divH.innerHTML = "<h1>WHAT IS THIS?</h1>";
        divImg.innerHTML = `<img src="${src}" id="${id}">`; // fixed
        let img = document.getElementById(id);
        img.style.transform = `scale(${zoom}) translate(${x}%, ${y}%)`;
        divInt.innerHTML = `
        <form id="guess-form">
            <input type="text" id="guess" required>
            <button type="submit">Guess!</button>
        </form>
        `;

        // Step 2: wait for response, check with answer
        const guessForm = document.querySelector('#guess-form');
        function onGuess(e) {
            e.preventDefault();
            const guess = document.querySelector('#guess').value;

            divH.innerHTML = (guess.trim().toLowerCase() === answer) ? "<h1>CORRECT!</h1>" : "<h1>INCORRECT!</h1>";
            document.body.style.backgroundColor = (guess.trim().toLowerCase() === answer) ? '#457014' : '#750000' ;
            img.style.transform = "scale(1) translate(0, 0)";
            // replace interact area with Next button
            divInt.innerHTML = `
                <h3>This is ${(['a','e','i','o','u'].includes(answer[0]) ? 'an' : 'a')} ${answer}</h3>
                <form id="next-form"><button type="submit">Next!</button></form>
            `;

            const nextForm = document.querySelector('#next-form');
            function onNext(ev) {
                ev.preventDefault();
                nextForm.removeEventListener('submit', onNext);
                guessForm.removeEventListener('submit', onGuess);
                resolve(); // allow the caller to continue to the next level
            }
            nextForm.addEventListener('submit', onNext);
        }
        guessForm.addEventListener('submit', onGuess);
    });
}

function changeBG() {
    let palette = ['#7A0027', '#8b3e18', '#8b7618', '#003887', '#3a0057'];
    palette.sort( () => Math.random()-0.5 );
    document.body.style.backgroundColor = palette.pop();
}