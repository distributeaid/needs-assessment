import { fromEnv } from '@nordicsemiconductor/from-env'
import { useAppConfig } from 'hooks/useAppConfig'
import { useFormValidator } from 'hooks/useFormValidator'
import {
	createContext,
	FunctionComponent,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import type { StoredForm } from 'schema/types'
import { handleResponse } from 'utils/handleResponse'
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

class FormError extends Error {
	public readonly reason: 'idMismatch' | 'other'
	constructor(message: string, reason: 'idMismatch' | 'other') {
		super(message)
		this.name = 'FormError'
		this.reason = reason
	}
}

export const StoredFormContext = createContext<{
	form?: StoredForm
	setFormUrl: (formUrl: URL) => void
	formUrl: URL
	fetchError?: Error
	formError?: FormError
}>({
	setFormUrl: () => undefined,
	formUrl: formUrlBoot,
})

export const useStoredForm = () => useContext(StoredFormContext)

export const StoredFormProvider: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const { storageUrl } = useAppConfig()
	const [form, setForm] = useState<StoredForm>()
	const [formUrl, setFormUrl] = useState<URL>(formUrlBoot)
	const [fetchError, setFetchError] = useState<Error>()
	const [formError, setFormError] = useState<FormError>()
	const validateForm = useFormValidator()

	const toFetchError = (error: Error) =>
		setFetchError(
			new Error(
				`There was an error fetching the form ${formUrl}: ${error.message}`,
			),
		)

	useEffect(() => {
		if (validateForm === undefined) return
		let isMounted = true
		console.debug(`Fetching form`, formUrl.toString())
		setForm(undefined)
		setFormError(undefined)
		fetch(formUrl.toString(), {
			method: 'GET',
		})
			.then(
				handleResponse(
					async (res) =>
						res.text().then((res) => {
							if (!isMounted) return
							const form = parseJSON(res)
							const valid = validateForm(form)
							if (valid === true) setForm(form as StoredForm)
						}),
					toFetchError,
				),
			)
			.catch(toFetchError)
		return () => {
			isMounted = false
		}
	}, [formUrl, storageUrl, validateForm])

	useEffect(() => {
		if (form === undefined) return
		if (form.$id !== formUrl.toString()) {
			setFormError(new FormError(`Form IDs do not match!`, 'idMismatch'))
		} else {
			setFormError(undefined)
		}
	}, [formUrl, form])

	return (
		<StoredFormContext.Provider
			value={{
				form,
				setFormUrl,
				formUrl,
				fetchError,
				formError,
			}}
		>
			{children}
		</StoredFormContext.Provider>
	)
}
