export const state = () => ({
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword:''
})

export const mutations = {
    setfirstName: (state, data) => {
        state.firstName = data
    },
    setlastName: (state, data) => {
        state.lastName = data
    },
    setEmail: (state, data) => {
        state.email = data
    },
    setPassword: (state, data) => {
        state.password = data
    },
    setconfirmPassword: (state, data) => {
        state.confirmPassword = data
    }
}