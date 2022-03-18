import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import './index.scss';

import ApolloProvider from './providers/ApolloProvider.jsx';

ReactDOM.render(<ApolloProvider />, document.getElementById('root'));
