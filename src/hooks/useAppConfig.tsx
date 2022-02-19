import { fromEnv } from '@nordicsemiconductor/from-env'
import { createContext, useContext } from 'react'

const {
	version,
	homepage,
	shortName,
	name,
	themeColor,
	backgroundColor,
	storageUrl,
	formId,
} = fromEnv({
	version: 'PUBLIC_VERSION',
	homepage: 'PUBLIC_HOMEPAGE',
	shortName: 'PUBLIC_MANIFEST_SHORT_NAME',
	name: 'PUBLIC_MANIFEST_NAME',
	themeColor: 'PUBLIC_MANIFEST_THEME_COLOR',
	backgroundColor: 'PUBLIC_MANIFEST_BACKGROUND_COLOR',
	storageUrl: `PUBLIC_STORAGE_URL`,
	formId: `PUBLIC_FORM_ID`,
})(import.meta.env)

export const AppConfigContext = createContext<{
	basename: string
	version: string
	homepage: string
	manifest: {
		shortName: string
		name: string
		themeColor: string
		backgroundColor: string
	}
	storageUrl: URL
	formUrl: URL
	schemaUrl: URL
}>({
	basename: import.meta.env.BASE_URL ?? '/',
	version,
	homepage,
	manifest: {
		shortName,
		name,
		themeColor,
		backgroundColor,
	},
	storageUrl: new URL(storageUrl),
	formUrl: new URL(`./form/${formId}`, storageUrl),
	schemaUrl: new URL('./schema', storageUrl),
})

export const useAppConfig = () => useContext(AppConfigContext)
