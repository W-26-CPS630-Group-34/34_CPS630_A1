// write functions for game input and output

const params = new URLSearchParams(window.location.search);
range = params.get('range') || '';

if (range !== '') {
    range.split(",");
    ids = []

    range.forEach(value => {
        value = value.trim()
        if (value.length == 1 && !ids.includes(value)) {
            ids.push(parseInt(value));
        } else {
            value.split("-");
            for (let i = parseInt(value[0]); i <= parseInt(value[1]); i++) {
                if (!ids.includes(value)) {
                    ids.push(parseInt(value));
                }
            }
        }
    });

    // loop over IDs, fetching each book and running the game loop
} else {
    // fetch all. See server.js for this command

    // run game over every JSON fetched
}

// when game is over, redirect back to root (index.html)