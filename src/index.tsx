// index.tsx

// importing React and DOM
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// importing tetris component
import Tetris from './components/tetrislogic'

// importing styles
import './styles/styles.css';


// importing service worker
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Tetris boardWidth="14" boardHeight="20" />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
