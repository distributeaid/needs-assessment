import Ajv, { AnySchema } from 'ajv'
import addFormats from 'ajv-formats'
import addKeywords from 'ajv-keywords'
import type { AnyValidateFunction } from 'ajv/dist/core'
import { useEffect, useState } from 'react'

const jsonSchemaValidator = new Ajv().getSchema(
	'http://json-schema.org/draft-07/schema',
)

export const useFormValidator = ({ schemaUrl }: { schemaUrl: URL }) => {
	const [validate, setValidate] = useState<AnyValidateFunction>()

	useEffect(() => {
		console.debug(`Fetching schema`, schemaUrl)
		fetch(schemaUrl.toString(), {
			method: 'GET',
		})
			.then(async (res) => res.text())
			.then((res) => {
				const formSchema = JSON.parse(res)
				const isValidJSONSchema = jsonSchemaValidator?.(formSchema)

				if (isValidJSONSchema === false) {
					console.error(
						`Schema downloaded from`,
						schemaUrl,
						`is not a valid JSON schema`,
						jsonSchemaValidator?.errors,
					)
					return
				}

				const ajv = new Ajv({
					schemas: [formSchema as AnySchema],
				})
				addFormats(ajv)
				addKeywords(ajv)

				const $id = formSchema.$id
				console.debug(`Creating validator for`, $id)
				const v = ajv.getSchema(formSchema.$id)
				if (v === undefined || (v as any) === false) {
					console.error(`Failed to create validator for`, $id)
					return
				}

				setValidate(() => v) // This is needed, otherwise React will see that `v` is a function, and call it.
			})
			.catch(console.error)
	}, [schemaUrl])

	return validate
}
