class TodoListModel {
  constructor() {
    this.idCounter = 0;
    this.todos = new Map();
  }

  /**
   * task を todo として todoList に追加する
   * @param {string} task
   * @returns 追加された todo の id
   */
  addTodo(task) {
    this.idCounter += 1;
    this.todos.set(this.idCounter, {
      id: this.idCounter,
      task,
      checked: false,
    });
    return this.idCounter;
  }

  removeTodo(id) {
    this.todos.delete(id);
  }

  checkTodo(id, isCheck) {
    const todo = this.todos.get(id);
    todo.checked = isCheck;
    return todo;
  }

  getTodo(id) {
    return this.todos.get(id);
  }
}

const todoList = new TodoListModel();

class View {
  /**
   *
   * @param {id: number, task: string} todo
   */
  addTodo(todo) {
    const todosEl = document.getElementById("todos");
    const todoEl = this._createTodoElement(todo);
    todosEl.appendChild(todoEl);
  }

  // checkbox をいじる
  // react化すると不要
  check(id) {
    const todoEl = document.getElementById(`todo-${id}`);
    todoEl.className = `checked`;
  }

  unCheck(id) {
    const todoEl = document.getElementById(`todo-${id}`);
    todoEl.className = "";
  }

  resetTodo() {
    const input = document.getElementById("task-input");
    input.value = ""; // input のリセット
  }

  removeTodo(id) {
    const todoEl = document.getElementById(`todo-${id}`);
    todoEl.remove();
  }

  /**
   *
   * @param {id: number, task: string} todo
   * @returns todoのHTML要素
   */
  _createTodoElement(todo) {
    const { id, task } = todo;
    const todoEl = document.createElement("li");
    todoEl.id = `todo-${id}`;
    const checkBoxEl = document.createElement("input");
    todoEl.appendChild(checkBoxEl);
    const labelEl = document.createElement("label");
    labelEl.innerText = task;
    checkBoxEl.type = "checkbox";
    checkBoxEl.id = `checkbox-${todo.id}`;
    todoEl.appendChild(labelEl);

    const buttonEl = document.createElement("button");
    buttonEl.innerText = "削除";
    buttonEl.onclick = function () {
      todoEl.remove();
    };
    todoEl.appendChild(buttonEl);

    return todoEl;
  }
}

const view = new View();

class Controller {
  setup() {
    this.handleSubmitForm();
    this.handleClickDeleteTask();
  }

  handleSubmitForm() {
    const formEl = document.getElementById("task-send-form");
    formEl.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const input = document.getElementById("task-input");
      const task = input.value;
      if (!task.length > 0) {
        alert("テキストを入力してください。");
        return;
      }
      const addedTodoId = todoList.addTodo(task);
      const todo = todoList.getTodo(addedTodoId);
      view.addTodo(todo);
      this.handleCheckTask(todo.id);
    });
  }

  handleCheckTask(id) {
    const checkBoxEl = document.getElementById(`checkbox-${id}`);
    checkBoxEl.onchange = function (e) {
      const checked = e.target.checked;
      const stateChangedTodo = todoList.checkTodo(id, checked);
      if (stateChangedTodo.checked) {
        view.check(stateChangedTodo.id);
      } else {
        view.unCheck(stateChangedTodo.id);
      }
    };
  }

  handleClickDeleteTask(id) {
    todoList.removeTodo(id);
    const buttonEl = document.getElementById(`button-${id}`);
    buttonEl.onclick = function () {
      view.removeTodo(id);
    };
  }
}

const formController = new Controller();
formController.setup();
