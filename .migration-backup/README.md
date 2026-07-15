# Word Sprint: Island Escape

A side-scrolling educational word game built with Phaser 3.

## About

**Word Sprint: Island Escape** turns vocabulary drills into a reaction-based platforming challenge. Your character walks across floating islands — but to jump over gaps, you must answer language questions correctly. Pick the wrong answer and you'll stumble; get it right and you leap forward to the next challenge.

## How to Play

1. The character walks automatically to the right.
2. When reaching a gap, the game pauses and presents a question with 3 answer choices.
3. Click the correct answer to jump over the gap and continue.
4. Wrong answers show a hint and let you retry.
5. Complete all questions to escape the island!

## Features

- 5 vocabulary questions (verb tenses, synonyms, nouns, antonyms)
- Auto-scrolling platformer mechanics
- Correct/wrong answer feedback with color changes and animations
- Hints provided for incorrect answers
- Score tracking and end screen with star rating
- Data-driven design — add new questions by editing `data/questions.json`

## Tech Stack

- **Engine:** Phaser 3 (JavaScript)
- **Language:** Vanilla JavaScript (ES6)
- **Physics:** Arcade Physics
- **Assets:** Procedurally generated textures (no external sprites)
- **Data Format:** JSON for question configuration
- **Server:** http-server for local development

## Running Locally

```bash
npm install
npm start
```

Then open `http://localhost:8080` in your browser.

## Project Structure

```
WordSprint_IslandEscape/
├── index.html              # Entry point
├── package.json            # Dependencies
├── data/
│   └── questions.json      # Question bank (editable)
├── js/
│   ├── config.js           # Phaser game configuration
│   ├── game.js             # Game initialization
│   └── scenes/
│       ├── BootScene.js    # Asset generation & loading
│       ├── GameScene.js    # Main gameplay loop
│       └── SuccessScene.js # End screen & score display
└── node_modules/
```

## License

MIT
