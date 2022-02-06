import formDefinition from 'schema/form.example.json'
import { ajv, schemaUrl } from 'utils/validateSchema'

describe('validateFormExample.spec', () => {
	it('should validate the form example', () => {
		const validate = ajv.getSchema(schemaUrl)
		expect(validate).not.toBeUndefined()
		const valid = validate?.(formDefinition)
		expect(valid).toEqual(true)
		expect(validate?.errors).toBeNull()
	})
})
