(() => {
    const WORD_BANK = [
        { word: "APPLE", hint: "Red or green fruit", category: "FOOD" },
        { word: "BREAD", hint: "You toast it", category: "FOOD" },
        { word: "WATER", hint: "Clear drink", category: "DRINK" },
        { word: "HOUSE", hint: "Place you live", category: "HOME" },
        { word: "TABLE", hint: "You eat on it", category: "HOME" },
        { word: "CHAIR", hint: "You sit on it", category: "HOME" },
        { word: "SPOON", hint: "Used for soup", category: "KITCHEN" },
        { word: "PHONE", hint: "Call someone", category: "OBJECT" },
        { word: "MONEY", hint: "You spend it", category: "DAILY" },
        { word: "SMILE", hint: "Happy face", category: "FEELING" },
        { word: "HAPPY", hint: "Feeling good", category: "FEELING" },
        { word: "GREEN", hint: "Color of grass", category: "COLOR" },
        { word: "BLACK", hint: "Opposite of white", category: "COLOR" },
        { word: "SLEEP", hint: "You do it at night", category: "DAILY" },
        { word: "BREAD", hint: "Sandwich base", category: "FOOD" },
        { word: "JUICE", hint: "Fruit drink", category: "DRINK" },
        { word: "MOUSE", hint: "Small animal or computer device", category: "ANIMAL" },
        { word: "PIZZA", hint: "Cheesy slice", category: "FOOD" },
        { word: "SHOES", hint: "You wear them outside", category: "CLOTHING" },
        { word: "LIGHT", hint: "Opposite of dark", category: "DAILY" },
        { word: "CLOUD", hint: "White in the sky", category: "NATURE" },
        { word: "RAIN", hint: "Water from sky", category: "WEATHER" },
        { word: "SUNNY", hint: "Bright day", category: "WEATHER" },
        { word: "BROOM", hint: "Used to sweep", category: "HOME" },
        { word: "PLATE", hint: "Food sits on it", category: "KITCHEN" },
        { word: "RIVER", hint: "Flowing water", category: "NATURE" },
        { word: "GRASS", hint: "Green ground cover", category: "NATURE" },
        { word: "FORK", hint: "You stab food", category: "KITCHEN" },
        { word: "DOG", hint: "Loyal pet", category: "ANIMAL" },
        { word: "CAT", hint: "Purrs softly", category: "ANIMAL" },
        { word: "BIRD", hint: "Animal that flies", category: "ANIMAL" },
        { word: "FISH", hint: "Swims in water", category: "ANIMAL" },
        { word: "BOOK", hint: "You read it", category: "OBJECT" },
        { word: "TRAIN", hint: "Long rail vehicle", category: "TRAVEL" },
        { word: "PLANE", hint: "Flies in sky", category: "TRAVEL" },
        { word: "BAG", hint: "Carries things", category: "OBJECT" },
        { word: "CLOCK", hint: "Tells time", category: "OBJECT" },
        { word: "SLIDE", hint: "Playground fun", category: "PLAY" },
        { word: "PARK", hint: "Green public place", category: "PLACE" },
        { word: "SCHOOL", hint: "Place to learn", category: "PLACE" },
        { word: "TEACHER", hint: "Person who helps you learn", category: "PEOPLE" },
        { word: "FRIEND", hint: "Someone you like", category: "PEOPLE" },
        { word: "FAMILY", hint: "Parents and siblings", category: "PEOPLE" },
        { word: "MUSIC", hint: "You listen to it", category: "ART" },
        { word: "PAINT", hint: "Used for color", category: "ART" },
        { word: "RING", hint: "Worn on finger", category: "OBJECT" },
        { word: "GLOVE", hint: "Worn on hand", category: "CLOTHING" },
        { word: "HAT", hint: "Worn on head", category: "CLOTHING" },
        { word: "MILK", hint: "White drink", category: "DRINK" },
        { word: "JUICE", hint: "Orange or apple drink", category: "DRINK" },
    ];

    const MAX_MISTAKES = 10; // matches number of parts
    const partsOrder = [
        "hm-head","hm-body","hm-arm-left","hm-arm-right",
        "hm-leg-left","hm-leg-right","hm-eye-left","hm-eye-right","hm-mouth","hm-rope"
    ];

    // Elements
    const wordDisplayEl = document.getElementById("word-display");
    const lettersGuessedEl = document.getElementById("letters-guessed");
    const messageEl = document.getElementById("message");
    const letterInput = document.getElementById("letter-input");
    const guessBtn = document.getElementById("guess-button");
    const resetBtn = document.getElementById("reset-button");
    const statusEl = document.getElementById("status");
    const keyboardEl = document.getElementById("keyboard");
    const winsEl = document.getElementById("wins");
    const lossesEl = document.getElementById("losses");
    const streakEl = document.getElementById("streak");
    const categoryEl = document.getElementById("category");
    const hintBtn = document.getElementById("hint-btn");
    const hintEl = document.getElementById("hint");
    const svg = document.getElementById("hangman-svg");

    let currentWordObj;
    let revealed;
    let guessed = new Set();
    let mistakes = 0;
    let wins = 0;
    let losses = 0;
    let streak = 0;
    let hintUsed = false;

    function pickWord() {
        return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    }

    function buildWordSlots() {
        wordDisplayEl.innerHTML = "";
        revealed = currentWordObj.word.split("").map(ch => (/[A-Z]/.test(ch) ? "_" : ch));
        currentWordObj.word.split("").forEach((char, i) => {
            const span = document.createElement("span");
            span.className = "slot";
            span.dataset.index = i;
            span.textContent = revealed[i] === "_" ? "" : char;
            wordDisplayEl.appendChild(span);
        });
    }

    function updateScoreboard() {
        winsEl.textContent = wins;
        lossesEl.textContent = losses;
        streakEl.textContent = streak;
    }

    function showMessage(text, type="") {
        messageEl.className = "message " + type;
        messageEl.textContent = text;
    }

    function updateLettersGuessed() {
        lettersGuessedEl.innerHTML = "";
        [...guessed].sort().forEach(l => {
            const span = document.createElement("span");
            span.className = "letter";
            span.textContent = l;
            lettersGuessedEl.appendChild(span);
        });
    }

    function revealSVGPart() {
        const partClass = partsOrder[mistakes - 1];
        if (!partClass) return;
        const part = svg.querySelector(`.${partClass}`);
        if (part) part.classList.add("show");
    }

    function buildKeyboard() {
        keyboardEl.innerHTML = "";
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "key";
            btn.textContent = letter;
            btn.dataset.letter = letter;
            btn.addEventListener("click", () => handleGuess(letter));
            keyboardEl.appendChild(btn);
        });
    }

    function updateKeyboardState(letter, good) {
        const el = keyboardEl.querySelector(`[data-letter='${letter}']`);
        if (!el) return;
        el.classList.add("used");
        el.classList.add(good ? "good" : "bad");
    }

    function refreshWordDisplay() {
        [...wordDisplayEl.children].forEach(span => {
            const idx = +span.dataset.index;
            const ch = revealed[idx];
            if (ch !== "_" && span.textContent !== ch) {
                span.textContent = ch;
                span.classList.add("revealed");
                setTimeout(() => span.classList.remove("revealed"), 700);
            }
        });
    }

    function checkWin() {
        if (!revealed.includes("_")) {
            wins++;
            streak++;
            showMessage("You Win!", "win");
            statusEl.textContent = "Great job!";
            endGame(true);
        }
    }

    function checkLose() {
        if (mistakes >= MAX_MISTAKES) {
            losses++;
            streak = 0;
            showMessage(`You Lose! Word: ${currentWordObj.word}`, "lose");
            statusEl.textContent = "Try again.";
            // Reveal rest
            currentWordObj.word.split("").forEach((ch, i) => {
                if (revealed[i] === "_") revealed[i] = ch;
            });
            refreshWordDisplay();
            endGame(false);
        }
    }

    function endGame(won) {
        updateScoreboard();
        letterInput.disabled = true;
        guessBtn.disabled = true;
        keyboardEl.querySelectorAll(".key").forEach(k => k.disabled = true);
        hintBtn.disabled = true;
        if (won) {
            wordDisplayEl.classList.add("won");
        } else {
            wordDisplayEl.classList.add("lost");
        }
    }

    function handleGuess(raw) {
        const letter = raw.toUpperCase();
        if (!/^[A-Z]$/.test(letter)) return;
        if (guessed.has(letter) || letterInput.disabled) return;
        guessed.add(letter);
        const positions = [];
        currentWordObj.word.split("").forEach((ch,i)=> {
            if (ch === letter) positions.push(i);
        });
        if (positions.length) {
            positions.forEach(i => revealed[i] = letter);
            updateKeyboardState(letter, true);
            updateLettersGuessed();
            refreshWordDisplay();
            showMessage(`Good: ${letter}`);
            checkWin();
        } else {
            mistakes++;
            updateKeyboardState(letter,false);
            updateLettersGuessed();
            revealSVGPart();
            showMessage(`Miss: ${letter}`);
            statusEl.textContent = `Mistakes: ${mistakes}/${MAX_MISTAKES}`;
            checkLose();
        }
    }

    function resetSVG() {
        svg.querySelectorAll(".hm-part").forEach(p => p.classList.remove("show"));
    }

    function newGame() {
        currentWordObj = pickWord();
        guessed.clear();
        mistakes = 0;
        hintUsed = false;
        hintEl.textContent = "";
        hintBtn.disabled = false;
        letterInput.disabled = false;
        guessBtn.disabled = false;
        wordDisplayEl.classList.remove("won","lost");
        statusEl.textContent = "Start guessing...";
        showMessage("");
        buildWordSlots();
        updateLettersGuessed();
        buildKeyboard();
        resetSVG();
        categoryEl.textContent = currentWordObj.category;
        letterInput.value = "";
        letterInput.focus();
    }

    function applyHint() {
        if (hintUsed) return;
        hintUsed = true;
        hintEl.textContent = currentWordObj.hint;
        hintBtn.disabled = true;
        // Reveal one random unrevealed letter
        const unrevealedIndexes = revealed
            .map((v,i)=> v==="_" ? i : -1)
            .filter(i=> i !== -1);
        if (unrevealedIndexes.length) {
            const i = unrevealedIndexes[Math.floor(Math.random()*unrevealedIndexes.length)];
            const letter = currentWordObj.word[i];
            handleGuess(letter);
        }
    }

    // Events
    guessBtn.addEventListener("click", () => {
        const val = letterInput.value.trim().toUpperCase();
        letterInput.value = "";
        handleGuess(val);
        letterInput.focus();
    });

    letterInput.addEventListener("keyup", e => {
        if (e.key === "Enter") {
            guessBtn.click();
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            handleGuess(e.key);
            letterInput.value = "";
        }
    });

    resetBtn.addEventListener("click", newGame);
    hintBtn.addEventListener("click", applyHint);

    document.addEventListener("keydown", e => {
        if (letterInput.disabled) return;
        if (/^[a-zA-Z]$/.test(e.key)) {
            handleGuess(e.key);
        }
    });

    // Init
    newGame();
})();