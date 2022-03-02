import { fromEnv } from '@nordicsemiconductor/from-env'
import { useAppConfig } from 'hooks/useAppConfig'
import { useFormValidator } from 'hooks/useFormValidator'
import {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'
import type { StoredForm } from 'schema/types'
import { parseJSON } from 'utils/parseJSON'

const { defaultFormUrl } = fromEnv({
	defaultFormUrl: `PUBLIC_DEFAULT_FORM_URL`,
})(import.meta.env)

let formUrlBoot = new URL(defaultFormUrl)
try {
	const formUrlFromQuery = new URLSearchParams(document.location.search).get(
		'form',
	)
	if (formUrlFromQuery !== null) formUrlBoot = new URL(formUrlFromQuery)
} catch {
	console.debug(`Failed to load form URL from query!`)
}

export const StoredFormContext = createContext<{
	form?: StoredForm
	setFormUrl: (formUrl: URL) => void
	formUrl: URL
	error?: Error
}>({
	setFormUrl: () => undefined,
	formUrl: formUrlBoot,
})

export const useStoredForm = () => useContext(StoredFormContext)

export const StoredFormProvider: FunctionComponent = ({ children }) => {
	const { storageUrl } = useAppConfig()
	const [form, setForm] = useState<StoredForm>()
	const [formUrl, setFormUrl] = useState<URL>(formUrlBoot)
	const [error, setError] = useState<Error>()
	const validateForm = useFormValidator()

	useEffect(() => {
		if (validateForm === undefined) return
		let isMounted = true
		console.debug(`Fetching form`, formUrl.toString())
		fetch(formUrl.toString(), {
			method: 'GET',
		})
			.then(async (res) => res.text())
			.then((res) => {
				if (!isMounted) return
				const form = parseJSON(res)
				const valid = validateForm(form)
				if (valid === true) setForm(form as StoredForm)
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
	}, [formUrl, storageUrl, validateForm])

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
