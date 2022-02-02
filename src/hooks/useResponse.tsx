import { createContext, FunctionComponent, useContext, useState } from 'react'

export const ResponseContext = createContext<{
	response: Record<string, any>
	update: (response: Record<string, any>) => void
}>({
	response: {},
	update: () => undefined,
})

export const useResponse = () => useContext(ResponseContext)

export const ResponseProvider: FunctionComponent = ({ children }) => {
	const [response, update] = useState<Record<string, any>>({})

	return (
		<ResponseContext.Provider
			value={{
				response,
				update,
			}}
		>
			{children}
		</ResponseContext.Provider>
	)
}
