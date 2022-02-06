import formExample from 'schema/form.example.json'
import { ajv, schemaUrl } from 'utils/validateSchema'

describe('validateFormExample()', () => {
	it('should validate the form example', () => {
		const validate = ajv.getSchema(schemaUrl)
		expect(validate).not.toBeUndefined()
		const valid = validate?.(formExample)
		expect(valid).toEqual(true)
		expect(validate?.errors).toBeNull()
	})
})
