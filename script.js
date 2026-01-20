const steps = [
    "Welcome to the Sophie Hood Knitting Guide 🧶\n\nYarn: DK weight\nNeedles: 4 mm\n\nClick Next to begin.",
    "Cast On\n\nCast on 6 stitches using your preferred method.",
    // ... add all your other steps from the Python code here ...
];

let state = JSON.parse(localStorage.getItem('sophieState')) || {
    step: 0,
    rows: 0
};

function updateDisplay() {
    document.getElementById('step-text').innerText = steps[state.step];
    document.getElementById('row-display').innerText = `Rows: ${state.rows}`;
    document.getElementById('progress-label').innerText = `Step ${state.step + 1} of ${steps.length}`;
    
    // Disable buttons if at start or end
    document.getElementById('prev-btn').disabled = state.step === 0;
    document.getElementById('next-btn').disabled = state.step === steps.length - 1;

    localStorage.setItem('sophieState', JSON.stringify(state));
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

function changeRow(val) {
    state.rows = Math.max(0, state.rows + val);
    updateDisplay();
}

function resetRows() {
    state.rows = 0;
    updateDisplay();
}

function resetAll() {
    if(confirm("Reset all progress?")) {
        state = { step: 0, rows: 0 };
        updateDisplay();
    }
}

updateDisplay();