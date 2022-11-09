var appConfig = {
    M: parseInt(process.env.VUE_APP_M),
    N: parseInt(process.env.VUE_APP_N),
    K: parseInt(process.env.VUE_APP_K),
    SCAN_DIRECTION_OPERATOR: [
        {'column': 0, 'row': -1}, // North
        {'column': 1, 'row': -1}, // North East
        {'column': 1, 'row': 0}, // East
        {'column': 1, 'row': 1}, // South East
        {'column': 0, 'row': 1}, // South
        {'column': -1, 'row': 1}, // South West
        {'column': -1, 'row': 0}, // West
        {'column': -1, 'row': -1}, // North West
    ]
}

export default appConfig