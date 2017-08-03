import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { ToDos } from '../../api/todos';


Meteor.startup(() => {
    let user = {};

    if (Meteor.users.find().count() === 0) {
        user = Accounts.createUser({
            email: 'default@user.com',
            password: 'password'
        });
    }

    if (ToDos.find().count() === 0) {
        ToDos.insert({
            title: 'Learn React',
            complete: false,
            owner: user,
        });
    }
});