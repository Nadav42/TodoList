import React from 'react';
import ReactDOM from 'react-dom';

// import { Provider } from 'mobx-react' --> causes issues with typescript props typing
import todoStore from './stores/todoStore'

import App from './App';

ReactDOM.render(<App todoStore={todoStore} />, document.getElementById('root'));