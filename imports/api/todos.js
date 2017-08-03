import { Mongo } from 'meteor/mongo';


// Allow client to do these things only to this collection:

// Create a todos publication that client can subscribe to
if (Meteor.isServer) {
    Meteor.publish('todos', function todosPublication() {
        return ToDos.find({ owner: this.userId });
    });
}

// Toggle Complete.  Toggling a todo as complete/not complete
// The argument is called todo here, but is referenced as item in toggleComplete in index.js
Meteor.methods({
    'todos.toggleComplete'(todo) {
        if (todo.owner !== this.userId) {
            throw new Meteor.Error('todos.toggleComplete.not-authorized',
                'You are not allowed to update to-dos for other users'
            )
        }
        ToDos.update(todo._id, {
            $set: { complete: !todo.complete }
        });
    },

    // Add todo
    'todos.addtodo'(data) {
        if (!this.userId) {
            throw new Meteor.Error('todos.addTodo.not-authorized',
                'You shall not add!'
            )
        }
        ToDos.insert({
            owner: this.userId,
            title: data,
            complete: false,
        });
    },


    'todos.removeToDo'(todo) {
        if (todo.owner !== this.userId) {
            throw new Meteor.Error('todos.removeTodo.not-authorized',
                'You shall not remove!'
            )
        }
        ToDos.remove(todo._id);
    },

    'todos.removeCompleted'() {
        if (!this.userId) {
            throw new Meteor.Error(
                'todos.removeComplete.not-authorized',
                'You shall not remove!'
            )
        }
        ToDos.remove({ complete: true, owner: this.userId });
    }
});

export const ToDos = new Mongo.Collection('todos');