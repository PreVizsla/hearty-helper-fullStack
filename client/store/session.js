export const state = () => ({
    patientName: '', 
    duration: '', 
    sid: '',
})

export const mutations = {
    setpatientName: (state, data) => {
        state.patientName = data
    },
    setduration: (state, data) => {
        state.duration = data
    },
    setsid: (state, data) => {
        state.sid = data
    },
}