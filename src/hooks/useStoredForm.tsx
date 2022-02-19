import { useAppConfig } from 'hooks/useAppConfig'
import {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'
import type { StoredForm } from 'schema/types'

export const StoredFormContext = createContext<{
	form?: StoredForm
	setFormId: (formId: string) => void
	formId: string
	error?: Error
}>({
	setFormId: () => undefined,
	formId: undefined as any,
})

export const useStoredForm = () => useContext(StoredFormContext)

export const StoredFormProvider: FunctionComponent = ({ children }) => {
	const { storageUrl, defaultFormId } = useAppConfig()
	const [form, setForm] = useState<StoredForm>()
	const [formId, setFormId] = useState<string>(defaultFormId)
	const [error, setError] = useState<Error>()

	useEffect(() => {
		let isMounted = true
		const formUrl = new URL(`./form/${formId}`, storageUrl)
		console.debug(`Fetching form`, formUrl)
		fetch(formUrl.toString(), {
			method: 'GET',
		})
			.then(async (res) => res.text())
			.then((res) => {
				if (!isMounted) return
				const form = JSON.parse(res)
				setForm(form)
			})
			.catch((error) => {
				setError(
					new Error(
						`There was an error fetching the form ${formUrl}: ${error.message}`,
					),
				)
			})
		return () => {
			isMounted = false
		}
	}, [formId, storageUrl])

	return (
		<StoredFormContext.Provider
			value={{
				form,
				setFormId,
				formId,
				error,
			}}
		>
			{children}
		</StoredFormContext.Provider>
	)
}
