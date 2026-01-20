import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import json
import os
import webbrowser
import random

SAVE_FILE = "sophie_hood_progress.json"

# --- Colors & Styles (Pastel Pink Theme) ---
PASTEL_PINK_BG = "#FCE4EC"  # Lightest pink
SOFT_PINK_CARD = "#FFF1F1"  # Very light cream-pink
HOT_PINK_ACCENT = "#F06292" # For highlights
DEEP_PINK_TEXT = "#880E4F"  # For readability
NAV_BLUE_PASTEL = "#90CAF9" # For "Next" button contrast

# --- Patterns and Steps ---
steps = [
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
]

SHAPING_SECTIONS = {
    3: { "label": "Hood Increases", "total_rows": 258 },
    4: { "label": "Hood Body", "total_rows": 20 },
    5: { "label": "1st Decrease Section", "total_rows": 32 },
    6: { "label": "2nd Decrease Section", "total_rows": 44 },
    7: { "label": "3rd Decrease Section", "total_rows": 54 },
    8: { "label": "1st Reinforcement Increase", "total_rows": 64 },
    9: { "label": "2nd Reinforcement Increase", "total_rows": 76 },
    10: { "label": "3rd Reinforcement Increase", "total_rows": 110 },
    12: { "label": "Second Tail Decreases", "total_rows": 246 }
}

# --- State Management ---
def load_state():
    if os.path.exists(SAVE_FILE):
        try:
            with open(SAVE_FILE, "r") as f:
                return json.load(f)
        except:
            pass
    return {"step": 0, "completed": [False] * len(steps), "rows": 0}

state = load_state()

def save_state():
    with open(SAVE_FILE, "w") as f:
        json.dump(state, f, indent=4)

# --- Helper Functions ---
def open_url(url):
    webbrowser.open_new(url)

def highlight_text():
    text_box.tag_config("increase", foreground="#C2185B", font=("Arial", 12, "bold"))
    text_box.tag_config("decrease", foreground="#1E88E5", font=("Arial", 12, "bold"))
    text_box.tag_config("link", foreground="#F06292", underline=1)
    
    text_box.tag_bind("link", "<Button-1>", lambda e: open_url("https://www.youtube.com/watch?v=8bVaQep2MWw"))
    
    # Highlight keywords
    for word in ["increase", "Increase"]:
        start = "1.0"
        while True:
            pos = text_box.search(word, start, stopindex=tk.END)
            if not pos: break
            text_box.tag_add("increase", pos, f"{pos}+{len(word)}c")
            start = f"{pos}+{len(word)}c"

    for word in ["decrease", "Decrease", "knit 2 together", "pass the transferred", "k2tog", "pass transferred", "psso"]:
        start = "1.0"
        while True:
            pos = text_box.search(word, start, stopindex=tk.END)
            if not pos: break
            text_box.tag_add("decrease", pos, f"{pos}+{len(word)}c")
            start = f"{pos}+{len(word)}c"

    url_str = "https://www.youtube.com/watch?v=8bVaQep2MWw"
    pos = text_box.search(url_str, "1.0", stopindex=tk.END)
    if pos: text_box.tag_add("link", pos, f"{pos}+{len(url_str)}c")

def shaping_ping():
    reminder_label.config(text="")
    row = state["rows"]
    step = state["step"]
    
    inc_color = "#C2185B"
    dec_color = "#1565C0"
    trans_color = "#4A148C"
    knit_color = "#2E7D32"

    if step == 3:
        if row >= 12 and (row - 12) % 6 == 0:
            reminder_label.config(text=f"💖 ROW {row}: INCREASE ROW!", fg=inc_color)
            
    elif step == 5: # Rows 21-32 (4-row cycle)
        if 21 <= row <= 32:
            cycle = (row - 21) % 4
            if cycle == 0: reminder_label.config(text=f"⚠️ ROW {row}: DECREASE (k2tog)", fg=dec_color)
            elif cycle in [1, 3]: reminder_label.config(text=f"🧶 ROW {row}: TRANSFER 3", fg=trans_color)
            else: reminder_label.config(text=f"🧶 ROW {row}: KNIT TO END", fg=knit_color)

    elif step == 6: # Rows 33-44 (4-row cycle)
        if 33 <= row <= 44:
            cycle = (row - 33) % 4
            if cycle == 0: reminder_label.config(text=f"⚠️ ROW {row}: DECREASE (k2tog)", fg=dec_color)
            elif cycle in [1, 3]: reminder_label.config(text=f"🧶 ROW {row}: TRANSFER 3", fg=trans_color)
            else: reminder_label.config(text=f"🧶 ROW {row}: KNIT TO END", fg=knit_color)
     
    elif step == 7: # Rows 45-54 (2-row cycle)
        if 45 <= row <= 54:
            if (row - 45) % 2 == 0: 
                reminder_label.config(text=f"⚠️ ROW {row}: DECREASE (k2tog)", fg=dec_color)
            else: 
                reminder_label.config(text=f"🧶 ROW {row}: TRANSFER 3", fg=trans_color)

    elif step == 8: # Rows 55-64 (2-row cycle)
        if 55 <= row <= 64:
            if (row - 55) % 2 == 0: reminder_label.config(text=f"💖 ROW {row}: INCREASE (End of Row)", fg=inc_color)
            else: reminder_label.config(text=f"💖 ROW {row}: INCREASE & TRANSFER (Start)", fg=inc_color)

    elif step == 9: # Rows 65-76 (2-row cycle)
        if 65 <= row <= 76:
            if (row - 65) % 2 == 0:
                reminder_label.config(text=f"💖 ROW {row}: INCREASE (last 2, inc, k1)", fg=inc_color)
            else:
                reminder_label.config(text=f"🧶 ROW {row}: Knit to last 3, then TRANSFER", fg=trans_color)

    elif step == 10: # Third Section of Increase (Updated Cycle)
        if 77 <= row <= 110:
            if (row - 77) % 2 == 0:
                reminder_label.config(text=f"💖 ROW {row}: INCREASE (last 2, inc, k1)", fg=inc_color)
            else:
                reminder_label.config(text=f"🧶 ROW {row}: Knit to last 3, then TRANSFER 3", fg=trans_color)

    elif step == 11: 
        if row == 1: reminder_label.config(text="🧶 ROW 1: PICK UP 3 stitches", fg=inc_color)
        elif row > 1: reminder_label.config(text=f"🧶 ROW {row}: Knit to last 3, then TRANSFER 3", fg=trans_color)

    elif step == 12: # Second Tail Decreases (Updated psso Logic)
        if 1 <= row <= 246:
            if (row - 1) % 6 == 0:
                reminder_label.config(text=f"⚠️ ROW {row}: DECREASE (k2, sl1, k1, psso)", fg=dec_color)
            else:
                reminder_label.config(text=f"🧶 ROW {row}: Knit to last 3, then TRANSFER 3", fg=trans_color)

# --- Confetti System (Pastel Colors) ---
confetti_particles = []
def start_confetti():
    confetti_canvas.place(relx=0, rely=0, relwidth=1, relheight=1)
    colors = ["#FF80AB", "#F48FB1", "#F06292", "#F8BBD0", "#E91E63"]
    for _ in range(80):
        x = random.randint(0, 500)
        y = random.randint(-200, 0)
        size = random.randint(2, 6)
        color = random.choice(colors)
        p = confetti_canvas.create_rectangle(x, y, x+size, y+size, fill=color, outline="")
        confetti_particles.append([p, random.randint(2, 6), random.randint(-1, 1)])
    animate_confetti()

def animate_confetti():
    if state["step"] == len(steps) - 1:
        for p in confetti_particles:
            confetti_canvas.move(p[0], p[2], p[1])
            pos = confetti_canvas.coords(p[0])
            if pos[1] > 780:
                new_x = random.randint(0, 500)
                new_s = random.randint(2, 5)
                confetti_canvas.coords(p[0], new_x, -20, new_x+new_s, -20+new_s)
        root.after(30, animate_confetti)
    else:
        confetti_canvas.place_forget()

# --- Display logic ---
def update_display():
    text_box.config(state="normal")
    text_box.delete("1.0", tk.END)
    text_box.insert(tk.END, steps[state["step"]])
    highlight_text()
    text_box.config(state="disabled")

    progress_label.config(text=f"Step {state['step'] + 1} of {len(steps)}", fg=DEEP_PINK_TEXT)
    completed_var.set(state["completed"][state["step"]])
    row_label.config(text=f"Rows: {state['rows']}", fg=DEEP_PINK_TEXT)
    
    shaping_ping()

    prev_btn.config(state="normal" if state["step"] > 0 else "disabled")
    next_btn.config(state="normal" if state["step"] < len(steps) - 1 else "disabled")

    if state["step"] == len(steps) - 1:
        start_confetti()
    else:
        confetti_canvas.place_forget()

    if state["step"] in SHAPING_SECTIONS:
        section = SHAPING_SECTIONS[state["step"]]
        shaping_label.config(text=section["label"], fg=DEEP_PINK_TEXT)
        shaping_bar["maximum"] = section["total_rows"]
        shaping_bar["value"] = min(state["rows"], section["total_rows"])
        shaping_frame.pack(pady=8)
    else:
        shaping_frame.pack_forget()
    save_state()

def next_step():
    state["step"] += 1
    update_display()

def prev_step():
    state["step"] -= 1
    update_display()

def toggle_completed():
    state["completed"][state["step"]] = completed_var.get()
    save_state()

def add_row():
    state["rows"] += 1
    update_display()

def remove_row():
    if state["rows"] > 0:
        state["rows"] -= 1
        update_display()

def reset_counter():
    state["rows"] = 0
    update_display()

def reset_all():
    if messagebox.askyesno("Reset", "Reset all progress?"):
        state["step"] = 0
        state["rows"] = 0
        state["completed"] = [False] * len(steps)
        update_display()

# --- UI Setup ---
root = tk.Tk()
root.title("🧶 Sophie Hood Knitting Guide")
root.geometry("500x780")
root.configure(bg=PASTEL_PINK_BG)

# Progress bar styling
style = ttk.Style()
style.theme_use('default')
style.configure("TProgressbar", thickness=15, troughcolor=SOFT_PINK_CARD, background=HOT_PINK_ACCENT)

confetti_canvas = tk.Canvas(root, highlightthickness=0, bg=PASTEL_PINK_BG)

text_box = tk.Text(root, wrap="word", font=("Arial", 12), height=10, bg=SOFT_PINK_CARD, fg=DEEP_PINK_TEXT, padx=15, pady=15, bd=0)
text_box.pack(padx=20, pady=20, fill="both", expand=True)

progress_label = tk.Label(root, font=("Arial", 10, "italic"), bg=PASTEL_PINK_BG)
progress_label.pack()

completed_var = tk.BooleanVar()
tk.Checkbutton(root, text="Mark step complete", variable=completed_var, command=toggle_completed, bg=PASTEL_PINK_BG, fg=DEEP_PINK_TEXT, activebackground=PASTEL_PINK_BG).pack(pady=5)

shaping_frame = tk.Frame(root, bg=PASTEL_PINK_BG)
shaping_label = tk.Label(shaping_frame, font=("Arial", 10, "bold"), bg=PASTEL_PINK_BG)
shaping_bar = ttk.Progressbar(shaping_frame, orient="horizontal", length=350, mode="determinate", style="TProgressbar")
shaping_label.pack()
shaping_bar.pack(pady=5)

reminder_label = tk.Label(root, font=("Arial", 12, "bold"), pady=10, bg=PASTEL_PINK_BG)
reminder_label.pack()

row_frame = tk.Frame(root, bg=PASTEL_PINK_BG)
row_frame.pack(pady=5)
tk.Button(row_frame, text="➕ Row", width=10, command=add_row, bg="#F8BBD0", fg=DEEP_PINK_TEXT).grid(row=0, column=0, padx=5)
row_label = tk.Label(row_frame, font=("Arial", 18, "bold"), width=8, bg=PASTEL_PINK_BG) 
row_label.grid(row=0, column=1)
tk.Button(row_frame, text="➖ Row", width=10, command=remove_row, bg="#F8BBD0", fg=DEEP_PINK_TEXT).grid(row=0, column=2, padx=5)
tk.Button(row_frame, text="🔄", width=3, command=reset_counter, bg=SOFT_PINK_CARD).grid(row=0, column=3, padx=10)

nav_frame = tk.Frame(root, bg=PASTEL_PINK_BG)
nav_frame.pack(pady=20)
prev_btn = tk.Button(nav_frame, text="⬅ Previous", width=15, command=prev_step, bg=SOFT_PINK_CARD)
prev_btn.grid(row=0, column=0, padx=10)
next_btn = tk.Button(nav_frame, text="Next ➡", width=15, command=next_step, bg=NAV_BLUE_PASTEL, fg="white", font=("Arial", 10, "bold"))
next_btn.grid(row=0, column=1, padx=10)

tk.Button(root, text="Reset All Progress", command=reset_all, fg="#AD1457", bg=PASTEL_PINK_BG, bd=0, font=("Arial", 8, "underline")).pack(pady=10)

update_display()
root.mainloop()