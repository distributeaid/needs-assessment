import { useForm } from 'hooks/useForm'
import { createContext, FunctionComponent, useContext, useState } from 'react'
import { evaluateJSONataExpression } from 'utils/evaluateJSONataExpression'
import { responseToTSV } from 'utils/responseToTSV'
import { withLocalStorage } from 'utils/withLocalStorage'

export type Response = Record<string, any>

const storedResponse = withLocalStorage<Response>({
	key: 'response',
	defaultValue: {},
})

export const ResponseContext = createContext<{
	response: Response
	update: (response: Response) => void
	download: () => void
}>({
	response: {},
	update: () => undefined,
	download: () => undefined,
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
				download: () => {
					if (form === undefined) return
					const file = new File(
						[responseToTSV(response, form)],
						`response-${new Date().toISOString()}.tsv`,
						{
							type: 'text/tsv',
						},
					)
					const link = document.createElement('a')
					link.style.display = 'none'
					link.href = URL.createObjectURL(file)
					link.download = file.name

					document.body.appendChild(link)
					link.click()

					setTimeout(() => {
						URL.revokeObjectURL(link.href)
						link.parentNode?.removeChild(link)
					}, 0)
				},
			}}
		>
			{children}
		</ResponseContext.Provider>
	)
}
