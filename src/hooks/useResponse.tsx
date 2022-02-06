import { useForm } from 'hooks/useForm'
import { createContext, FunctionComponent, useContext, useState } from 'react'
import { evaluateJSONataExpression } from 'utils/evaluateJSONataExpression'
import { withLocalStorage } from 'utils/withLocalStorage'

export type Response = Record<string, any>

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

export const isRequired = (
	{
		required,
	}: {
		required?: boolean | string
	},
	response: Response,
): boolean => {
	if (required === undefined) return false
	if (typeof required === 'boolean') {
		return required
	}
	return evaluateJSONataExpression({
		expression: required,
		response,
		debug: console.debug,
		error: console.error,
	})
}

export const ResponseProvider: FunctionComponent = ({ children }) => {
	const [response, update] = useState<Response>(storedResponse.get())
	const { form } = useForm()

	return (
		<ResponseContext.Provider
			value={{
				response,
				update: (response) => {
					// remove answers from all hidden sections and questions
					form?.sections.forEach((section) => {
						if (isHidden(section, response)) {
							response[section.id] = undefined
						} else {
							section.questions.forEach((question) => {
								if (
									isHidden(question, response) &&
									response[section.id]?.[question.id] !== undefined
								) {
									response[section.id][question.id] = undefined
								}
							})
						}
					})
					update(response)
					storedResponse.set(response)
				},
			}}
		>
			{children}
		</ResponseContext.Provider>
	)
}
