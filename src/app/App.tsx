import { FormGenerator } from 'app/pages/FormGenerator'
import { Navbar } from 'components/Navbar'
import { useAppConfig } from 'hooks/useAppConfig'
import { FormProvider } from 'hooks/useForm'
import { ResponseProvider } from 'hooks/useResponse'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

export const App = () => {
	const { basename } = useAppConfig()
	return (
		<FormProvider>
			<ResponseProvider>
				<Router basename={basename}>
					<Navbar />
					<Routes>
						<Route index element={<FormGenerator />} />
					</Routes>
				</Router>
			</ResponseProvider>
		</FormProvider>
	)
}
