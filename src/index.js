class TodoListModel {
  constructor() {
    this.idCounter = 0;
    this.todos = new Map();
  }

  /**
   * task を todo として todoList に追加する.
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

  /**
   * 指定idのTODOを削除
   * @param {number} id TODOのid
   */
  removeTodo(id) {
    this.todos.delete(id);
  }

  /**
   * TODOの完了状態を変更する
   * @param {number} id TODOのid
   * @param {boolean} isCheck 次のcheck状態
   * @returns 更新済みTODO
   */
  checkTodo(id, isCheck) {
    const todo = this.todos.get(id);
    todo.checked = isCheck;
    return todo;
  }

  /**
   * 指定したidのTODOを取得
   * @param {number} id TODOのid
   * @returns TODO
   */
  getTodo(id) {
    return this.todos.get(id);
  }
}

const todoList = new TodoListModel();

class View {
  /**
   * TODOをUIに追加する
   * @param {id: number, task: string, isCheck: boolean} todo
   */
  addTodo(todo) {
    const todosEl = document.getElementById("todos");
    const todoEl = this._createTodoElement(todo);
    todosEl.appendChild(todoEl);
  }

  /**
   * todoをチェックに応じてスタイルを変える
   * @param {*} id TODOのid
   */
  check(id) {
    const todoEl = document.getElementById(`todo-${id}`);
    todoEl.className = `checked`;
  }

  /**
   * todoをチェックに応じてスタイルを変える
   * @param {*} id TODOのid
   */
  unCheck(id) {
    const todoEl = document.getElementById(`todo-${id}`);
    todoEl.className = "";
  }

  /**
   * input form をリセットする
   */
  resetTodo() {
    const input = document.getElementById("task-input");
    input.value = ""; // input のリセット
  }

  /**
   * 指定したTODOをDOMから削除する
   * @param {*} id TODOのid
   */
  removeTodo(id) {
    const todoEl = document.getElementById(`todo-${id}`);
    todoEl.remove();
  }

  /**
   * TODO要素を作る
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

  /**
   * タスク送信時にTODO追加とUI反映をする
   */
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

  /**
   * 指定したcheckboxの状態変化に応じてTODO更新とUI反映をする
   * @param {number} id TODOのid
   */
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

  /**
   * 指定したTODO削除とUI反映をする
   * @param {*} id TODOのid
   */
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
