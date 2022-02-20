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
	setFormUrl: (formUrl: URL) => void
	formUrl: URL
	error?: Error
}>({
	setFormUrl: () => undefined,
	formUrl: undefined as any,
})

export const useStoredForm = () => useContext(StoredFormContext)

export const StoredFormProvider: FunctionComponent = ({ children }) => {
	const { storageUrl, defaultFormUrl } = useAppConfig()
	const [form, setForm] = useState<StoredForm>()
	const [formUrl, setFormUrl] = useState<URL>(defaultFormUrl)
	const [error, setError] = useState<Error>()

	useEffect(() => {
		let isMounted = true
		console.debug(`Fetching form`, formUrl.toString())
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
	}, [formUrl, storageUrl])

	return (
		<StoredFormContext.Provider
			value={{
				form,
				setFormUrl,
				formUrl,
				error,
			}}
		>
			{children}
		</StoredFormContext.Provider>
	)
}
