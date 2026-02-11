# Zoomble (CPS330 Assignment 1, Group 34)

Zoomble is a web game where users attempt to guess the subject of an image based on a very zoomed in selection of it. Users can also source their own images and create their own levels. Note that answers are singular words, so as to keep answers from getting too long and convoluted.

## Extended Content (Coming Soon???)
In the future, it would be great to add a second step to the creation page. Users have to estimate the final look of their level, but an interactive viewer that renders the image as seen in-game would solve this issue.

Users can only provide externally sourced images, or images already included in the package. Users should be able to upload image files that get stored.

Images and their JSON data should ideally be stored on a database. The current JSON array is a quick prototyping construct for proof of concept, and not very expandable in its current form.

Singular words are a restriction of how the app applies grammar to display responses to user guesses. Later, it should be possible to have images of plural subjects, and still display a grammatically correct message.

## Documentation
Install all dependencies by running:
```
npm install
```
Run the app with this command:
```
npm start
```
Or run the server directly:
```
node server.js
```

## Reflection
Overall, the most difficult part of developing this game was the weirdness of `async`. These types of functions have their own weird behaviour, and affect how many things work (such as input boxes). Furthermore, they don't return typical values. They return something called a `Promise()`, which waits a certain time to return a certain value. The entirety of the app logic had to be constructed around this, not really with it, which is a major regret of the development process. 