import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToDos } from '../../../api/todos';
import { createContainer } from 'meteor/react-meteor-data';
import './styles.css';
import AccountsUIWrapper from '../../components/AccountsUIWrapper';

const ToDoItem = ({ todoProp, toggleComplete, removeToDo }) => (
  <li>{todoProp.title}
    <input
      type="checkbox"
      id={todoProp._id}
      checked={todoProp.complete}
      onChange={() => toggleComplete(todoProp)} />
    <label htmlFor={todoProp._id}></label>
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
    this.removeCompleted = this.removeCompleted.bind(this)
  }

  componentDidMount() {
    if (this.props.currentUser)
      this.ToDoInput.focus();
  }

  toggleComplete(item) {
    Meteor.call('todos.toggleComplete', item);
  }

  removeToDo(item) {
    Meteor.call('todos.removeToDo', item)
  }

  removeCompleted = () => {
   Meteor.call('todos.removeCompleted')
  }

  hasCompleted() {
    const completed = this.props.todos.filter(todo => todo.complete);
    return completed.length ? true : false;
  }

  addToDo = (event) => {
    event.preventDefault();
    if (this.toDoInput.value) {
      Meteor.call('todos.addtodo', this.toDoInput.value);
    }
    this.toDoInput.value = '';
  }

  render() {

    const { todos } = this.props;

    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsUIWrapper />
        </div>
        <div className="todo-list">
          <h1>So Much To Do</h1>
          {(!this.props.currentUserId) ?
            <div className="logged-out-message">
              <p>Please sign in to see your todos.</p>
            </div>
            :
            <div>
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
          }
        </div>
      </div>

    )
  }
}

App.defaultProps = {
  todos: []
}

App.protoTypes = {
  todos: PropTypes.array.isRequired,
  currentUserId: PropTypes.string,
  currentUser: PropTypes.object
}

export default createContainer(() => {
Meteor.subscribe('todos');

  return {
    currentUser: Meteor.user(),
    currentUserId: Meteor.userId(),
    todos: ToDos.find().fetch()
  }
}, App);