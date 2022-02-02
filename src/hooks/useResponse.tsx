import { createContext, FunctionComponent, useContext, useState } from 'react'
import { withLocalStorage } from 'utils/withLocalStorage'

const storedResponse = withLocalStorage<Record<string, any>>({
	key: 'response',
	defaultValue: {},
})

export const ResponseContext = createContext<{
	response: Record<string, any>
	update: (response: Record<string, any>) => void
}>({
	response: {},
	update: () => undefined,
})

export const useResponse = () => useContext(ResponseContext)

export const ResponseProvider: FunctionComponent = ({ children }) => {
	const [response, update] = useState<Record<string, any>>(storedResponse.get())

	return (
		<ResponseContext.Provider
			value={{
				response,
				update: (response) => {
					update(response)
					storedResponse.set(response)
				},
			}}
		>
			{children}
		</ResponseContext.Provider>
	)
}
