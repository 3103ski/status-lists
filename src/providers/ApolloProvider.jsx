import React from 'react';

import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
// import { split } from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from 'apollo-link-context';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

import CombinedUserProvider from './CombinedUserProvider';

import App from '../App';

import { TOKEN_TITLE } from '../config';
import { GQL_SERVER_URL } from '../routes.js';

const cache = new InMemoryCache({
	typePolicies: {
		User: {
			keyFields: ['id'],
		},
		UserInfo: {
			keyFields: ['displayName', 'userId'],
		},
	},
});

// const wsLink = new WebSocketLink({
// 	uri: `${process.env.REACT_APP_GQL_SUBSCRIPTION_SERVER_URL}`,
// 	options: {
// 		reconnect: true,
// 	},
// });

const httpLink = createHttpLink({
	uri: `${GQL_SERVER_URL}`,
});

const authLink = setContext(() => {
	const token = localStorage.getItem(TOKEN_TITLE);
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

// const splitLink = split(
// 	({ query }) => {
// 		const definition = getMainDefinition(query);
// 		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
// 	},
// 	wsLink,
// 	authLink.concat(httpLink)
// );

async function persist() {
	await persistCache({
		cache,
		storage: new LocalStorageWrapper(window.localStorage),
	});
}

persist();

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache,
});

const Provider = (props) => {
	return (
		<ApolloProvider client={client}>
			<CombinedUserProvider {...props}>
				<App />
			</CombinedUserProvider>
		</ApolloProvider>
	);
};

export default Provider;
