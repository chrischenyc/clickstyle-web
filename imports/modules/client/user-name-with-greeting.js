import _ from 'lodash';

const greetings = ['Hey', 'Hi', 'Hello', 'Howdy'];

const userNameWithGreeting = ({ first }) => `${_.sample(greetings)}, I'm ${first}`;

export default userNameWithGreeting;
