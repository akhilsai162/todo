import React, { Component } from "react";
import "./todo.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      listArr: [],
      len: 0,
      editingIndex: -1,
      editText: "",
      todoId: 0,
      selected: [],
    };
  }

  componentDidMount() {
    this.showTasks();
  }

  addTask = () => {
    const { inputText, listArr, todoId } = this.state;
    toast.success("task has added");
    if (inputText.trim() !== "") {
      
      if (listArr.some(task => task.todoTitle === inputText)) {
        toast.error("Task already exists!");
        return;
      }

      const newTask = {
        todoTitle: inputText,
        markHasChecked: false,
        todoId: todoId + 1,
      };

      this.setState(
        (prevState) => ({
          inputText: "",
          todoId: prevState.todoId + 1,
          listArr: [newTask, ...prevState.listArr],
        }),
        () => {
          localStorage.setItem("new todo", JSON.stringify(this.state.listArr));
        }
      );
    }
  };

  showTasks = () => {
    const getLocalStorage = localStorage.getItem("new todo");
    const listArr = getLocalStorage ? JSON.parse(getLocalStorage) : [];
    this.setState({ listArr });
  };

  deleteTask = (index) => {
    const { listArr } = this.state;
    listArr.splice(index, 1);
    localStorage.setItem("new todo", JSON.stringify(listArr));
    this.showTasks();
    toast.warning("Delete successful");
  };

  handleMultiSelect = (id) => {
    this.setState((prevState) => ({
      listArr: prevState.listArr.map((todo) =>
        todo.todoId === id
          ? { ...todo, markHasChecked: !todo.markHasChecked }
          : todo
      ),
    }));
  };

 

  clearCheckedTodo = () => {
    const { listArr } = this.state;
    const checkedTasks = listArr.filter((todo) => todo.markHasChecked);

    if (checkedTasks.length > 0) {
      this.setState((prevState) => ({
        listArr: prevState.listArr.filter((todo) => !todo.markHasChecked),        
      }));
    }     
    toast.warning(" checked tasks cleared");
    
  };

  deleteAllTasks = () => {
    localStorage.setItem("new todo", JSON.stringify([]));
    toast.warn(" all tasks deleted");
    this.showTasks();
  };

  editTask = (index) => {
    const { listArr } = this.state;
    const editText = listArr[index].todoTitle;
    this.setState({ editingIndex: index, editText });
  };

  updateTask = () => {
    const { editingIndex, editText, listArr } = this.state;

    if (editText.trim() !== "") {
      listArr[editingIndex].todoTitle = editText;
      localStorage.setItem("new todo", JSON.stringify(listArr));
      this.setState({ editingIndex: -1, editText: "" }, () => {
        this.showTasks();
      });
      toast.success("  task has been updated");
    }
  };

  render() {
    const { inputText, listArr, editingIndex, editText } = this.state;

    return (
      <div className="container">
        <header>Todo App</header>
        <div className="inputField">
          <input
            type="text"
            placeholder="Add your new todo"
            value={inputText}
            onChange={(e) => this.setState({ inputText: e.target.value })}
          />
          <button onClick={this.addTask}>Add</button>
        </div>
        <ul className="todolist">
          {listArr.map((element, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <div>
                  <input
                    className="editinput"
                    type="text"
                    value={editText}
                    onChange={(e) =>
                      this.setState({ editText: e.target.value })
                    }
                  />
                  <button className="updatebtn" onClick={this.updateTask}>
                    Update
                  </button>
                </div>
              ) : (
                <div>
                  <span className="inptcheck">
                    <input
                      type="checkbox"
                      checked={element.markHasChecked}
                      onChange={() => {
                        this.handleMultiSelect(element.todoId);
                      }}
                    />
                  </span>
                  {element.todoTitle}
                  <span onClick={() => this.deleteTask(index)}>Delete</span>
                  <span onClick={() => this.editTask(index)}>Edit</span>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="footer">
          <span>
            You have <span className="pending">{listArr.length}</span> pending
            tasks
          </span>
          {listArr.some((task) => task.markHasChecked) ? (
            <button type="button" onClick={this.clearCheckedTodo}>
              Clear Checked
            </button>
          ) : null}
          {listArr.length>0?<button onClick={this.deleteAllTasks}>Clear All</button>:null}
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default TodoApp;
