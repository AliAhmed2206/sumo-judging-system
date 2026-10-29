// Universal Tournament State History Manager (Undo / Redo Engine)
// Stores state snapshots with action descriptions, supporting deep rollback for any action.

const MAX_HISTORY = 40;

export class HistoryTracker {
  constructor(initialState) {
    this.past = [];
    this.present = initialState;
    this.future = [];
  }

  canUndo() {
    return this.past.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  pushState(newPresent, actionDescription = 'Update') {
    if (JSON.stringify(newPresent) === JSON.stringify(this.present)) {
      return;
    }

    this.past.push({
      state: JSON.parse(JSON.stringify(this.present)),
      action: actionDescription,
      timestamp: new Date().toLocaleTimeString()
    });

    if (this.past.length > MAX_HISTORY) {
      this.past.shift();
    }

    this.present = JSON.parse(JSON.stringify(newPresent));
    this.future = []; // Clear redo stack on new action
  }

  undo() {
    if (!this.canUndo()) return null;

    const previous = this.past.pop();
    this.future.unshift({
      state: JSON.parse(JSON.stringify(this.present)),
      action: previous.action,
      timestamp: new Date().toLocaleTimeString()
    });

    this.present = previous.state;
    return {
      state: this.present,
      undoneAction: previous.action
    };
  }

  redo() {
    if (!this.canRedo()) return null;

    const next = this.future.shift();
    this.past.push({
      state: JSON.parse(JSON.stringify(this.present)),
      action: next.action,
      timestamp: new Date().toLocaleTimeString()
    });

    this.present = next.state;
    return {
      state: this.present,
      redoneAction: next.action
    };
  }

  getLastAction() {
    if (this.past.length === 0) return null;
    return this.past[this.past.length - 1].action;
  }
}
