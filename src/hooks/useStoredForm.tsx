import { useEffect, useState } from 'react'
import type { Form } from 'schema/types'

export const useStoredForm = ({ formUrl }: { formUrl: URL }) => {
	const [form, setForm] = useState<Form>()

	useEffect(() => {
		console.debug(`Fetching form`, formUrl)
		fetch(formUrl.toString(), {
			method: 'GET',
		})
			.then(async (res) => res.text())
			.then((res) => {
				const form = JSON.parse(res)
				setForm(form)
			})
			.catch(console.error)
	}, [formUrl])

	return form
}
