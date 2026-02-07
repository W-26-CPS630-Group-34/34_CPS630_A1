let palette = ['#7A0027', '#750000', '#8b3e18', '#8b7618', '#457014', '#003887', '#3a0057'];
palette.sort( () => Math.random()-0.5 );
document.body.style.backgroundColor = palette.pop();

document.querySelector('#new-form').addEventListener('submit', async (e) => {
    e.preventDefault(); //prevent form submission
    const newCrop = {
        id: parseInt(document.querySelector('#new-id').value),
        src: document.querySelector('#new-src').value,
        answer: document.querySelector('#new-answer').value,
        zoom: parseInt(document.querySelector('#new-zoom').value),
        x: parseInt(document.querySelector('#new-x').value),
        y: parseInt(document.querySelector('#new-y').value)
    };
    try {
        const response = await fetch('/api/crop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCrop)
        });
        const result = await response.json();
        if (response.status === 201) {
            alert('Level added successfully!');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding level:', error);
    }
});

document.querySelector('#delete-form').addEventListener('submit', async (e) => {
    e.preventDefault(); //prevent form submission
    const id = parseInt(document.querySelector('#delete-id').value);
    try {
        const response = await fetch(`/api/crop/id/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            alert('Level deleted successfully!');
        } else {
            const result = await response.json();
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting level:', error);
    }
});