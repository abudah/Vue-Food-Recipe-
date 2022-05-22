import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import VueApollo, { ApolloProvider } from 'vue-apollo';

// Import the Auth0 configuration
import { domain, clientId } from '../auth_config.json';

// Import the plugin here
import { Auth0Plugin } from './auth';

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false


const httpLink = new HttpLink({
  uri: 'https://food-recipeapp.hasura.app/v1/graphql'
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});



new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App)
}).$mount('#app')
