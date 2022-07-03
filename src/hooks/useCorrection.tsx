import { useResponse } from 'hooks/useResponse'
import { useStoredForm } from 'hooks/useStoredForm'
import {
	createContext,
	FunctionComponent,
	ReactNode,
	useContext,
	useState,
} from 'react'
import { handleResponse } from 'utils/handleResponse'

export const CorrectionContext = createContext<{
	submission?: {
		$id: URL
		form: URL
		response: Record<string, any>
		version: number
	}
	load: (url: URL) => Promise<void>
	clear: () => void
}>({
	load: async () => Promise.reject(new Error('Not ready!')),
	clear: () => undefined,
})

export const useCorrection = () => useContext(CorrectionContext)

export const CorrectionProvider: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const [submission, setSubmission] = useState<{
		$id: URL
		form: URL
		response: Record<string, any>
		version: number
	}>()
	const { setFormUrl } = useStoredForm()
	const { update, clear: clearResponse } = useResponse()

	return (
		<CorrectionContext.Provider
			value={{
				load: async (url) => {
					setSubmission(undefined)
					const res = await fetch(url, {
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
						headers: {
							accept: 'application/json; charset=utf-8',
						},
					})
					await handleResponse(
						async (res) => {
							const { form, response } = await res.json()
							setSubmission({
								$id: new URL(url),
								response,
								form: new URL(form),
								version: parseInt(res.headers.get('etag') ?? '1', 10),
							})
							setFormUrl(new URL(form))
							update(response)
						},
						(err) => {
							throw err
						},
					)(res)
				},
				clear: () => {
					setSubmission(undefined)
					clearResponse()
				},
				submission,
			}}
		>
			{children}
		</CorrectionContext.Provider>
	)
}
