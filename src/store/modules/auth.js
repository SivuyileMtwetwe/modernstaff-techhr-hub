
export default {
    namespaced: true,
    state: {
      user: JSON.parse(localStorage.getItem('loggedInUser') || '{}')
    },
    mutations: {
      SET_USER(state, user) {
        state.user = user
        localStorage.setItem('loggedInUser', JSON.stringify(user))
      },
      CLEAR_USER(state) {
        state.user = {}
        localStorage.removeItem('loggedInUser')
      }
    },
    actions: {
      async login({ commit }, credentials) {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find(
          u => u.username === credentials.username && 
              u.password === credentials.password
        )
        
        if (user) {
          commit('SET_USER', user)
        } else {
          throw new Error('Invalid credentials')
        }
      },
      logout({ commit }) {
        commit('CLEAR_USER')
      }
    }
  }