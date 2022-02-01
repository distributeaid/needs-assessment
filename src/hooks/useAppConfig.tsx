import { fromEnv } from '@nordicsemiconductor/from-env'
import { createContext, useContext } from 'react'

const { version, homepage, shortName, name, themeColor, backgroundColor } =
	fromEnv({
		version: 'PUBLIC_VERSION',
		homepage: 'PUBLIC_HOMEPAGE',
		shortName: 'PUBLIC_MANIFEST_SHORT_NAME',
		name: 'PUBLIC_MANIFEST_NAME',
		themeColor: 'PUBLIC_MANIFEST_THEME_COLOR',
		backgroundColor: 'PUBLIC_MANIFEST_BACKGROUND_COLOR',
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
})

export const useAppConfig = () => useContext(AppConfigContext)
