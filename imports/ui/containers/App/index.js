import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

const ToDoItem = ({ todoProp, toggleComplete, removeToDo }) => (
  <li>{todoProp.title}
    <input
      type="checkbox"
      id={todoProp.id}
      checked={todoProp.complete}
      onChange={() => toggleComplete(todoProp)} />
    <label htmlFor={todoProp.id}></label>
    <button onClick={() => removeToDo(todoProp)}>
      <i className="fa fa-trash"></i>
    </button>
  </li>
);


const ClearButton = ({ removeCompleted }) => (
  <button onClick={removeCompleted}>Clear Completed</button>
);

const ToDoCount = ({ number }) => (
  <p>{number} {number === 1 ? 'To Do' : 'To Dos'}</p>
);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 0, title: 'Learn react', complete: false }
      ],
      lastID: 0
    }
    this.removeCompleted = this.removeCompleted.bind(this)
  }

  componentDidMount() {
    this.toDoInput.focus();
  }

  toggleComplete = (item) => {
    const newTodos = this.state.todos.map(todo => {
      if (item.id === todo.id) {
        todo.complete = !todo.complete
      }
      return todo;
    });
    this.setState({ todos: newTodos });
  }

  removeToDo = (item) => {
    const newTodos = this.state.todos.filter(todo => item.id !== todo.id);

    this.setState({ todos: newTodos })
  }

  removeCompleted = () => {
    const newTodos = this.state.todos.filter(todo => !todo.complete);
    this.setState({ todos: newTodos });
  }

  hasCompleted() {
    const completed = this.state.todos.filter(todo => todo.complete);
    //if there's anything in completed array return true, else return false
    // return completed.length ? true : false;
    // return completed.length >0 ? true : false;    
    return !!completed.length;
  }

  addToDo = (event) => {
    event.preventDefault();

    const id = this.state.lastID + 1;

    if (this.toDoInput.value) {

      const newTodos = this.state.todos.concat({
        id,
        title: this.toDoInput.value,
        complete: false
      });

      this.setState({
        todos: newTodos,
        lastID: id
      });
      this.toDoInput.value = '';
    }
  }

  render() {

    const { todos } = this.state;

    return (
      <div className="todo-list">
        <h1>So Much To Do</h1>
        <div className="add-todo">
          <form name="addTodo" onSubmit={this.addToDo}>
            <input type="text" ref={(input) => (this.toDoInput = input)} />
            <span>(press enter to add)</span>
          </form>
        </div>
        <ul>
          {todos.map((todo, index) => (
            <ToDoItem key={index} todoProp={todo} toggleComplete={() => this.toggleComplete(todo)} removeToDo={this.removeToDo} />
          ))}
        </ul>
        <div className="todo-admin">
          <ToDoCount number={todos.length} />
          {this.hasCompleted() &&
            <ClearButton removeCompleted={this.removeCompleted} />
          }
        </div>
      </div>

    )
  }
}

ToDoCount.propTypes = {
  number: PropTypes.number.isRequired
};

ClearButton.propTypes = {
  removeCompleted: PropTypes.func.isRequired
};

ToDoItem.propTypes = {
  todoProp: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    complete: PropTypes.bool
  }).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  removeToDo: PropTypes.func.isRequired,
};

export default App;
