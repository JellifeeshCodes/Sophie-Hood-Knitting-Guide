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
    const textBox = document.getElementById('text-box');
    const rowCount = document.getElementById('row-count');
    const progressLabel = document.getElementById('progress-label');
    
    if (!textBox) return; // Guard clause if HTML hasn't loaded

    const stepText = steps[state.step];
    
    // Highlight links and keywords
    let formattedText = stepText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    formattedText = formattedText.replace(/(increase|Increase)/g, '<span style="color:#C2185B; font-weight:bold;">$1</span>');
    formattedText = formattedText.replace(/(decrease|Decrease|knit 2 together|k2tog|psso|pass transferred|pass the transferred)/g, '<span style="color:#1E88E5; font-weight:bold;">$1</span>');
    
    textBox.innerHTML = formattedText;
    if (progressLabel) progressLabel.innerText = `Step ${state.step + 1} of ${steps.length}`;
    if (rowCount) rowCount.innerText = `Rows: ${state.rows}`;

    // Shaping Progress Bar
    const section = SHAPING_SECTIONS[state.step];
    const container = document.getElementById('shaping-container');
    const bar = document.getElementById('shaping-bar');
    const label = document.getElementById('shaping-label');

    if (section && container && bar) {
        container.classList.remove('hidden');
        if (label) label.innerText = section.label;
        const percent = Math.min((state.rows / section.total) * 100, 100);
        bar.style.width = percent + '%';
    } else if (container) {
        container.classList.add('hidden');
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.disabled = state.step === 0;
    if (nextBtn) nextBtn.disabled = state.step === steps.length - 1;

    shapingPing();
    saveState();
}

function shapingPing() {
    const r = document.getElementById('reminder-label');
    if (!r) return;

    r.innerText = "";
    const row = state.rows;
    const step = state.step;
    
    const colors = {
        inc: "#C2185B",
        dec: "#1565C0",
        trans: "#4A148C",
        knit: "#2E7D32"
    };

    if (step === 3) {
        if (row >= 12 && (row - 12) % 6 === 0) {
            r.innerText = `💖 ROW ${row}: INCREASE ROW!`;
            r.style.color = colors.inc;
        }
    } else if (step === 5 || step === 6) {
        const startRow = (step === 5) ? 21 : 33;
        const endRow = (step === 5) ? 32 : 44;
        if (row >= startRow && row <= endRow) {
            const cycle = (row - startRow) % 4;
            if (cycle === 0) { r.innerText = `⚠️ ROW ${row}: DECREASE (k2tog)`; r.style.color = colors.dec; }
            else if (cycle === 1 || cycle === 3) { r.innerText = `🧶 ROW ${row}: TRANSFER 3`; r.style.color = colors.trans; }
            else { r.innerText = `🧶 ROW ${row}: KNIT TO END`; r.style.color = colors.knit; }
        }
    } else if (step === 7) {
        if (row >= 45 && row <= 54) {
            if ((row - 45) % 2 === 0) { r.innerText = `⚠️ ROW ${row}: DECREASE (k2tog)`; r.style.color = colors.dec; }
            else { r.innerText = `🧶 ROW ${row}: TRANSFER 3`; r.style.color = colors.trans; }
        }
    } else if (step === 8) {
        if (row >= 55 && row <= 64) {
            if ((row - 55) % 2 === 0) r.innerText = `💖 ROW ${row}: INCREASE (End of Row)`;
            else r.innerText = `💖 ROW ${row}: INCREASE & TRANSFER (Start)`;
            r.style.color = colors.inc;
        }
    } else if (step === 9 || step === 10) {
        const startRow = (step === 9) ? 65 : 77;
        const endRow = (step === 9) ? 76 : 110;
        if (row >= startRow && row <= endRow) {
            if ((row - startRow) % 2 === 0) { r.innerText = `💖 ROW ${row}: INCREASE (last 2, inc, k1)`; r.style.color = colors.inc; }
            else { r.innerText = `🧶 ROW ${row}: Knit to last 3, then TRANSFER`; r.style.color = colors.trans; }
        }
    } else if (step === 11) {
        if (row === 1) { r.innerText = "🧶 ROW 1: PICK UP 3 stitches"; r.style.color = colors.inc; }
        else if (row > 1) { r.innerText = `🧶 ROW ${row}: Knit to last 3, then TRANSFER 3`; r.style.color = colors.trans; }
    } else if (step === 12) {
        if (row >= 1 && row <= 246) {
            if ((row - 1) % 6 === 0) { r.innerText = `⚠️ ROW ${row}: DECREASE (k2, sl1, k1, psso)`; r.style.color = colors.dec; }
            else { r.innerText = `🧶 ROW ${row}: Knit to last 3, then TRANSFER 3`; r.style.color = colors.trans; }
        }
    }
}

// Global functions for buttons
window.changeRow = function(val) {
    state.rows = Math.max(0, state.rows + val);
    updateDisplay();
};

window.resetRows = function() {
    state.rows = 0;
    updateDisplay();
};

window.nextStep = function() {
    if (state.step < steps.length - 1) {
        state.step++;
        updateDisplay();
    }
};

window.prevStep = function() {
    if (state.step > 0) {
        state.step--;
        updateDisplay();
    }
};

window.resetAll = function() {
    if (confirm("Reset all progress?")) {
        state = { step: 0, rows: 0 };
        updateDisplay();
    }
};

// Ensure scripts run after DOM is ready
document.addEventListener('DOMContentLoaded', updateDisplay);
