(function() {
  const STORAGE_KEY = 'arm_learning_tracker_v1';

  function getState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return {
      milestones: {
        'm1': false,
        'm2': false,
        'm3': false,
        'm4': false,
        'm5': false,
        'm6': false,
        'm7': false,
        'm8': false
      },
      learnedPages: {},
      customTodos: [
        { id: 1, text: 'Review basic A64 instruction encodings', done: false },
        { id: 2, text: 'Master condition flags (N, Z, C, V) in PSTATE', done: false }
      ]
    };
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(e) {}
  }

  const MILESTONES = [
    { id: 'm1', cat: 'Core', title: 'Register Model & Execution State (X0-X30, W0-W30, SP, PC, XZR)' },
    { id: 'm2', cat: 'Control', title: 'Condition Codes & Branches (NZCV, B.cond, CBZ/CBNZ, TBNZ, BLR)' },
    { id: 'm3', cat: 'ALU', title: 'Arithmetic & Logical Ops (ADD, SUB, AND, ORR, EOR, Shifts, Bitfield)' },
    { id: 'm4', cat: 'Memory', title: 'Load/Store & Addressing Modes (LDR, STR, STP, LDP, Tagging)' },
    { id: 'm5', cat: 'SIMD', title: 'Advanced SIMD / Neon (V0-V31, 64-bit & 128-bit Vector Processing)' },
    { id: 'm6', cat: 'SVE', title: 'Scalable Vector Extension (SVE/SVE2, Predicate Registers P0-P15)' },
    { id: 'm7', cat: 'SME', title: 'Scalable Matrix Extension (SME, 2D Tile Storage, Streaming Mode)' },
    { id: 'm8', cat: 'System', title: 'System Architecture (Exception Levels EL0-EL3, MMU, MRS, MSR)' }
  ];

  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('learning-tracker-container');
    if (!container) return;

    const currentPath = window.location.pathname.replace(/\/$/, '');
    const isHomePage = currentPath === '' || currentPath === '/index' || currentPath === '/index.html';

    let state = getState();

    function render() {
      const learnedCount = Object.keys(state.learnedPages).length;
      const completedMilestones = MILESTONES.filter(m => state.milestones[m.id]).length;
      const completedTodos = state.customTodos.filter(t => t.done).length;
      const totalTasks = MILESTONES.length + state.customTodos.length;
      const totalDone = completedMilestones + completedTodos;
      const percent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

      if (isHomePage) {
        renderHomePage(totalTasks, totalDone, percent, learnedCount);
      } else {
        renderDetailPage(learnedCount);
      }
    }

    function renderHomePage(totalTasks, totalDone, percent, learnedCount) {
      const filledBars = Math.round(percent / 5);
      const emptyBars = 20 - filledBars;
      const progressBar = '='.repeat(Math.max(0, filledBars - 1)) + (filledBars > 0 ? '>' : '') + '-'.repeat(emptyBars);

      let milestonesHtml = MILESTONES.map(m => `
        <div style="margin: 0.35rem 0; display: flex; align-items: flex-start; gap: 0.5rem;">
          <input type="checkbox" id="ms-${m.id}" ${state.milestones[m.id] ? 'checked' : ''} style="cursor: pointer; margin-top: 0.2rem;" />
          <label for="ms-${m.id}" style="cursor: pointer; ${state.milestones[m.id] ? 'text-decoration: line-through; opacity: 0.7;' : ''}">
            <b style="color: var(--color-accent); font-size: 0.85rem;">[${m.cat}]</b> ${m.title}
          </label>
        </div>
      `).join('');

      let todosHtml = state.customTodos.map(todo => `
        <div style="margin: 0.3rem 0; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="todo-${todo.id}" ${todo.done ? 'checked' : ''} style="cursor: pointer;" />
            <label for="todo-${todo.id}" style="cursor: pointer; ${todo.done ? 'text-decoration: line-through; opacity: 0.7;' : ''}">
              ${escapeHtml(todo.text)}
            </label>
          </div>
          <button data-del="${todo.id}" style="background: none; border: 1px solid var(--color-fg-primary); color: var(--color-fg-primary); cursor: pointer; font-size: 0.75rem; padding: 0.1rem 0.4rem; font-family: var(--font-main);">DEL</button>
        </div>
      `).join('');

      container.innerHTML = `
        <div style="border: 1px solid var(--color-accent); background: var(--color-bg-secondary); padding: 1rem 1.2rem; margin-bottom: 1.5rem; font-family: var(--font-main);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px dashed var(--color-fg-primary); padding-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 700; font-size: 1.05rem; letter-spacing: 0.03em;">
              ARM ARCHITECTURE LEARNING TRACKER
            </div>
            <div style="font-size: 0.85rem; color: var(--color-accent);">
              [${learnedCount} Reference Pages Studied]
            </div>
          </div>

          <div style="margin-bottom: 1rem; font-family: var(--font-main);">
            <div style="margin-bottom: 0.3rem; font-size: 0.85rem;">
              Milestones & Goals Progress: <b>${totalDone}/${totalTasks}</b> (${percent}%)
            </div>
            <div style="font-weight: bold; color: var(--color-accent); font-size: 0.9rem; word-break: break-all;">
              [${progressBar}] ${percent}%
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--color-fg-primary); opacity: 0.85;">
              - Core Architecture Milestones -
            </div>
            ${milestonesHtml}
          </div>

          <div>
            <div style="font-weight: 700; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--color-fg-primary); opacity: 0.85;">
              - Personal Study To-Do List -
            </div>
            <div id="todos-container" style="margin-bottom: 0.6rem;">
              ${todosHtml || '<div style="opacity: 0.6; font-size: 0.85rem;">No custom to-dos yet. Add one below!</div>'}
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <input type="text" id="new-todo-input" placeholder="e.g. Master SVE predicate logic..." style="flex: 1; padding: 0.3rem 0.5rem; font-family: var(--font-main); font-size: 0.85rem; background: var(--color-bg-primary); color: var(--color-fg-primary); border: 1px solid var(--color-fg-primary);" />
              <button id="add-todo-btn" style="padding: 0.3rem 0.8rem; font-family: var(--font-main); font-weight: 700; font-size: 0.85rem; background: var(--color-bg-hint); color: var(--color-fg-primary); border: 1px solid var(--color-fg-primary); cursor: pointer;">+ ADD</button>
            </div>
          </div>
        </div>
      `;

      // Event listeners for homepage
      MILESTONES.forEach(m => {
        const chk = document.getElementById(`ms-${m.id}`);
        if (chk) {
          chk.addEventListener('change', (e) => {
            state.milestones[m.id] = e.target.checked;
            saveState(state);
            render();
          });
        }
      });

      state.customTodos.forEach(todo => {
        const chk = document.getElementById(`todo-${todo.id}`);
        if (chk) {
          chk.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            saveState(state);
            render();
          });
        }
      });

      container.querySelectorAll('button[data-del]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-del'), 10);
          state.customTodos = state.customTodos.filter(t => t.id !== id);
          saveState(state);
          render();
        });
      });

      const addBtn = document.getElementById('add-todo-btn');
      const input = document.getElementById('new-todo-input');
      if (addBtn && input) {
        const handleAdd = () => {
          const text = input.value.trim();
          if (text) {
            state.customTodos.push({ id: Date.now(), text, done: false });
            saveState(state);
            render();
          }
        };
        addBtn.addEventListener('click', handleAdd);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') handleAdd();
        });
      }
    }

    function renderDetailPage(learnedCount) {
      const pageKey = window.location.pathname;
      const isLearned = !!state.learnedPages[pageKey];

      container.innerHTML = `
        <div style="border: 1px solid var(--color-accent); background: var(--color-bg-secondary); padding: 0.6rem 1rem; margin-bottom: 1.2rem; font-family: var(--font-main); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <button id="toggle-learned-btn" style="background: ${isLearned ? 'var(--color-bg-detail)' : 'var(--color-bg-primary)'}; color: var(--color-fg-primary); border: 1px solid var(--color-fg-primary); font-family: var(--font-main); font-weight: 700; font-size: 0.85rem; padding: 0.35rem 0.7rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
              <span>${isLearned ? '[✓] LEARNED' : '[ ] MARK AS LEARNED'}</span>
            </button>
            <span style="font-size: 0.85rem; opacity: 0.8;">
              ${isLearned ? 'Studied & marked in your personal tracker' : 'Click to track your progress'}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.85rem;">
            <span>Total Studied: <b style="color: var(--color-accent);">${learnedCount}</b> items</span>
            <a href="/" style="color: var(--color-accent); text-decoration: underline;">View Roadmap →</a>
          </div>
        </div>
      `;

      const toggleBtn = document.getElementById('toggle-learned-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          if (state.learnedPages[pageKey]) {
            delete state.learnedPages[pageKey];
          } else {
            state.learnedPages[pageKey] = {
              title: document.title || pageKey,
              date: new Date().toISOString()
            };
          }
          saveState(state);
          render();
        });
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    render();
  });
})();
