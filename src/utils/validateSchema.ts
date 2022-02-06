import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addKeywords from 'ajv-keywords'
import formSchema from 'schema/form.schema.json'
import questionSchema from 'schema/question.schema.json'
import sectionSchema from 'schema/section.schema.json'

export const ajv = new Ajv({
	schemas: [formSchema, sectionSchema, questionSchema],
})
addFormats(ajv)
addKeywords(ajv)

export const schemaUrl = `https://distributeaid.github.io/needs-assessment/form.schema.json`
