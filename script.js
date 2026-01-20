const steps = [
    "Welcome to the Sophie Hood Knitting Guide 🧶\n\nThis app guides you step by step.\n\nYarn: DK weight\nNeedles: 4 mm\n\nClick Next to begin.",
    "Cast On\n\nCast on 6 stitches using your preferred method.",
    "Scarf Tail 1\n\nRow 1: Knit 3 stitches, then transfer last 3 stitches\n\nRepeat until Row 12 increase.",
    "Hood Increases\n\nRow 12: Knit 2 stitches, increase, knit till 3 stitches left, then transfer\n\nIncrease every 6th row.\n\nRepeat until Row 258.",
    "Hood Body\n\nIncrease stitches to match the desired width of the hood.\n\nOn the increase side, slip the first 3 stithes onto a marker.\n\nRow 1: Knit to the last 3 stiches, then transfer 3 stitches.\n\nRow 2: Knit to the end.\n\nRepeat until you finish row 20.",
    "Decreasing the hood\n\nRow 21: Knit to the last 3 stitches, knit 2 together, then knit 1.\n\nRow 22: Knit to the last 3 stitches, then transfer.\n\nRow 23: Knit to the end.\n\nRow 24: Knit to the last 3 stitches, then transfer.\n\nRepeat these 4 rows 2 more times until you reach row 32.",
    "Second Section of Decrease\n\nStarting on the non-increase side:\n\nRow 33: Knit to the last 3 stitches, knit 2 together, then knit 1.\n\nRow 34: Knit to the last 3 stitches, then transfer.\n\nRow 35: Knit to the end.\n\nRow 36: Knit to the last 3 stitches, then transfer.\n\nRepeat these 4 rows until you reach row 44.",
    "Third Section of Decrease\n\nStarting on the non-increase side:\n\nRow 45: Knit to the last 3 stitches, knit 2 together, then knit 1.\n\nRow 46: Knit 2 together, knit to the last 3 stitches, transfer 3.\n\nRepeat these 2 rows 5 times until you reach row 54.",
    "Hood Increase\n\nRow 55: Knit to the last 2 stitches, increase, knit 1.\n\nRow 56: Knit 1, increase, knit to the last 3, transfer 3.\n\nRepeat these 2 rows 5 times until you reach row 64.",
    "Second Section of Increase\n\nRow 65: Knit to the last 2 stitches, increase, knit 1.\n\nRow 66: Knit to the last 3 stitches, transfer 3.\n\nRepeat these 2 rows 6 times until you reach row 76.",
    "Third Section of Increase\n\nRow 77: Knit to the last 2 stitches, increase, knit 1.\n\nRow 78: Knit to the last 3 stitches, transfer 3.\n\nRepeat these 2 rows 17 times until you reach row 110.",
    "Hood Base\n\nRow 1: Knit to the end, put your yarn in front, then pick up the marked 3 stitches.\n\nRow 2: Knit to the last 3 stitches, then transfer.\n\nRepeat Row 2 until it matches the first base of the tail.",
    "Second Scarf Tail\n\nMark where your increase side is (now the decrease side).\n\nRow 1: Knit 2, transfer 1, knit 1, pass transferred stitch over. Knit to last 3, transfer.\n\nRepeat 6-row cycle until row 246.",
    "Bind Off\n\nBind off loosely.",
    "Seaming the Hood\n\nMatch the hood and pin together.\n\nFollow guide for mattress stitch: https://www.youtube.com/watch?v=8bVaQep2MWw",
    "Finished 🎉\n\nYour Sophie Hood is complete.\n\nWell done!"
];

const SHAPING_SECTIONS = {
    3: { label: "Hood Increases", total: 258 },
    4: { label: "Hood Body", total: 20 },
    5: { label: "1st Decrease Section", total: 32 },
    6: { label: "2nd Decrease Section", total: 44 },
    7: { label: "3rd Decrease Section", total: 54 },
    8: { label: "1st Reinforcement Increase", total: 64 },
    9: { label: "2nd Reinforcement Increase", total: 76 },
    10: { label: "3rd Reinforcement Increase", total: 110 },
    12: { label: "Second Tail Decreases", total: 246 }
};

// State Management
let state = JSON.parse(localStorage.getItem('sophieProgress')) || {
    step: 0,
    rows: 0
};

function saveState() {
    localStorage.setItem('sophieProgress', JSON.stringify(state));
}

function updateDisplay() {
    const stepText = steps[state.step];
    
    // Highlight links and keywords
    let formattedText = stepText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    formattedText = formattedText.replace(/(increase|Increase)/g, '<span style="color:#C2185B; font-weight:bold;">$1</span>');
    formattedText = formattedText.replace(/(decrease|Decrease|k2tog|psso)/g, '<span style="color:#1E88E5; font-weight:bold;">$1</span>');
    
    document.getElementById('text-box').innerHTML = formattedText;
    document.getElementById('progress-label').innerText = `Step ${state.step + 1} of ${steps.length}`;
    document.getElementById('row-count').innerText = `Rows: ${state.rows}`;

    // Shaping Progress Bar
    const section = SHAPING_SECTIONS[state.step];
    const container = document.getElementById('shaping-container');
    if (section) {
        container.classList.remove('hidden');
        document.getElementById('shaping-label').innerText = section.label;
        const percent = Math.min((state.rows / section.total) * 100, 100);
        document.getElementById('shaping-bar').style.width = percent + '%';
    } else {
        container.classList.add('hidden');
    }

    // Navigation buttons
    document.getElementById('prev-btn').disabled = state.step === 0;
    document.getElementById('next-btn').disabled = state.step === steps.length - 1;

    shapingPing();
    saveState();
}

function shapingPing() {
    const r = document.getElementById('reminder-label');
    r.innerText = "";
    const row = state.rows;
    const step = state.step;

    if (step === 3 && row >= 12 && (row - 12) % 6 === 0) {
        r.innerText = `💖 ROW ${row}: INCREASE ROW!`;
        r.style.color = "#C2185B";
    } else if (step === 5 && row >= 21 && row <= 32) {
        const cycle = (row - 21) % 4;
        if (cycle === 0) r.innerText = `⚠️ ROW ${row}: DECREASE (k2tog)`;
        else if (cycle === 1 || cycle === 3) r.innerText = `🧶 ROW ${row}: TRANSFER 3`;
        else r.innerText = `🧶 ROW ${row}: KNIT TO END`;
        r.style.color = "#1565C0";
    }
    // (You can add the rest of the logic for steps 6-12 here following the same pattern)
}

function changeRow(val) {
    state.rows = Math.max(0, state.rows + val);
    updateDisplay();
}

function resetRows() {
    state.rows = 0;
    updateDisplay();
}

function nextStep() {
    if (state.step < steps.length - 1) {
        state.step++;
        updateDisplay();
    }
}

function prevStep() {
    if (state.step > 0) {
        state.step--;
        updateDisplay();
    }
}

function resetAll() {
    if (confirm("Reset all progress?")) {
        state = { step: 0, rows: 0 };
        updateDisplay();
    }
}

// Initial Run
updateDisplay();
