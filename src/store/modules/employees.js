
export default {
    namespaced: true,
    state: {
      employees: []
    },
    mutations: {
      SET_EMPLOYEES(state, employees) {
        state.employees = employees
      },
      ADD_EMPLOYEE(state, employee) {
        state.employees.push(employee)
      },
      UPDATE_EMPLOYEE(state, updatedEmployee) {
        const index = state.employees.findIndex(
          emp => emp.employeeId === updatedEmployee.employeeId
        )
        if (index !== -1) {
          state.employees[index] = updatedEmployee
        }
      },
      DELETE_EMPLOYEE(state, employeeId) {
        state.employees = state.employees.filter(
          emp => emp.employeeId !== employeeId
        )
      }
    },
    actions: {
      async fetchEmployees({ commit }) {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]')
        commit('SET_EMPLOYEES', employees)
      },
      async addEmployee({ commit, state }, employee) {
        commit('ADD_EMPLOYEE', employee)
        localStorage.setItem('employees', JSON.stringify(state.employees))
      }
      // ... other employee actions
    }
  }