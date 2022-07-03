import { App } from 'app/App'
import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'

const container = document.getElementById('root')

if (container !== null) {
	const root = ReactDOMClient.createRoot(container)
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
