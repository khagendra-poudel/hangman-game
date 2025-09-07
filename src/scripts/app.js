(() => {
    const WORD_BANK = [
        { word: "JAVASCRIPT", hint: "Popular scripting language", category: "TECH" },
        { word: "ASYNCHRONOUS", hint: "Non-blocking execution style", category: "TECH" },
        { word: "ALGORITHM", hint: "A step-by-step procedure", category: "CS" },
        { word: "BANDWIDTH", hint: "Data transfer capacity", category: "TECH" },
        { word: "VARIABLE", hint: "Named storage", category: "CS" },
        { word: "FUNCTION", hint: "Reusable block", category: "CS" },
        { word: "OPTIMIZATION", hint: "Improving performance", category: "GENERAL" },
        { word: "ENCAPSULATION", hint: "OOP principle", category: "CS" },
        { word: "RECURSION", hint: "A function inside itself", category: "CS" },
        { word: "POLYMORPHISM", hint: "Many forms", category: "CS" },
        { word: "HANGMAN", hint: "The game you are playing", category: "META" },
        { word: "PYTHON", hint: "A programming language and a snake", category: "TECH" },
        { word: "DEBUGGING", hint: "Finding and fixing issues", category: "CS" },
        { word: "COMPILER", hint: "Translates code to machine language", category: "TECH" },
        { word: "FRAMEWORK", hint: "Predefined structure for apps", category: "TECH" },
        { word: "DATABASE", hint: "Organized data storage", category: "TECH" },
        { word: "INHERITANCE", hint: "OOP mechanism", category: "CS" },
        { word: "CLOSURE", hint: "Function with preserved scope", category: "CS" },
        { word: "JQUERY", hint: "JavaScript library", category: "TECH" },
        { word: "KOTLIN", hint: "Modern language for Android", category: "TECH" },
        { word: "VARIABLES", hint: "Containers for data values", category: "CS" },
        { word: "CONSTANT", hint: "Immutable value", category: "CS" },
        { word: "STRING", hint: "Sequence of characters", category: "CS" },
        { word: "INTEGER", hint: "Whole number", category: "CS" },
        { word: "BOOLEAN", hint: "True or False value", category: "CS" },
        { word: "ARRAY", hint: "Ordered collection", category: "CS" },
        { word: "OBJECT", hint: "Key-value pairs", category: "CS" },
        { word: "LOOP", hint: "Repeating block of code", category: "CS" },
        { word: "CONDITION", hint: "If-else statement", category: "CS" },
        { word: "EVENT", hint: "User interaction trigger", category: "TECH" },
        { word: "DEBUGGER", hint: "Tool for debugging code", category: "TECH" },
        { word: "GITHUB", hint: "Code hosting platform", category: "TECH" },
        { word: "VARIABLES", hint: "Used to store data", category: "CS" },
        { word: "FUNCTIONS", hint: "Blocks of reusable code", category: "CS" },
        { word: "OBJECTS", hint: "Instances of classes", category: "CS" },
        { word: "CLASSES", hint: "Blueprints for objects", category: "CS" },
        { word: "INTERNET", hint: "Global network", category: "GENERAL" },
        { word: "SOFTWARE", hint: "Programs and applications", category: "GENERAL" },
        { word: "HARDWARE", hint: "Physical components", category: "GENERAL" },
        { word: "KHAGENDRA", hint: "The best computer teacher.", category: "Human" },
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