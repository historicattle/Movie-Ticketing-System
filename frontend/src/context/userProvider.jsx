import userContext from '../context/userProvider'

const userProvider = ({ children }) => {
    const isUser = userContext()
    return (
        <userContext.Provider value={isUser}>
            {children}
        </userContext.Provider>
    )
}

export default userProvider