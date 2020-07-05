export default {
  tasks: {
    async send({api, store, root}, payload) {
      payload.refresh = store.state.token.refresh;
      let {data} = await api.res('login', 'auth').post(payload);
      root.run('auth/token', data); //
      return data;
    },
  },
}
