(async function main() {
    const params = new URLSearchParams(window.location.search);
    let range = params.get('range') || '';
    const crops = await loadCrops();
    if (!crops || crops.length === 0) return;
    let listOfCrops = [];
    if (range != '') {
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

    } else {
        listOfCrops = crops;
    }
    for (const crop of listOfCrops) {
        await initGame(crop); // waits for player to hit Next
    }

    // when game is over, redirect back to root (index.html)
        document.querySelector('#heading').innerHTML = "<h1>THANKS FOR PLAYING!</h1>";
        document.querySelector('#image').innerHTML = "<h3>Click the button below to head back to the home page</h3>";
        document.querySelector('#interact').innerHTML = `<a href="/" class="btn">Home</a>`;
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


function initGame(crop) {
    return new Promise(resolve => {
        const { id, src, answer, zoom, x, y } = crop;
        const divH = document.querySelector('#heading');
        const divImg = document.querySelector('#image');
        const divInt = document.querySelector('#interact');

        // Step 1: Game screen + user input
        divH.innerHTML = "<h1>WHAT IS THIS?</h1>";
        divImg.innerHTML = `<img src="${src}" id="${id}" height="100">`; // fixed
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