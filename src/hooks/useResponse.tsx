import { createContext, FunctionComponent, useContext, useState } from 'react'
import { evaluateJSONataExpression } from 'utils/evaluateJSONataExpression'
import { withLocalStorage } from 'utils/withLocalStorage'

type Response = Record<string, any>

const storedResponse = withLocalStorage<Response>({
	key: 'response',
	defaultValue: {},
})

export const ResponseContext = createContext<{
	response: Response
	update: (response: Response) => void
}>({
	response: {},
	update: () => undefined,
})

export const useResponse = () => useContext(ResponseContext)

export const isHidden = (
	{
		hidden,
	}: {
		hidden?: boolean | string
	},
	response: Response,
): boolean => {
	if (hidden === undefined) return false
	if (typeof hidden === 'boolean') {
		return hidden
	}
	return evaluateJSONataExpression({
		expression: hidden,
		response,
		debug: console.debug,
		error: console.error,
	})
}

export const ResponseProvider: FunctionComponent = ({ children }) => {
	const [response, update] = useState<Response>(storedResponse.get())

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
