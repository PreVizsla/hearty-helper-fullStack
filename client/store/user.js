export const state = () => ({
    firstName: '', 
    lastname: '', 
    email: '', 
    password: '', 
    confirmPassword:''
})

export const mutations = {
    setfirstName: (state, data) => {
        state.firstName = data
    },
    setlastName: (state, data) => {
        state.lastname = data
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