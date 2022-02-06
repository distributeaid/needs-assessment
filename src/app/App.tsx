import { FormGenerator } from 'app/pages/FormGenerator'
import { Privacy } from 'app/pages/Privacy'
import { Welcome } from 'app/pages/Welcome'
import { Navbar } from 'components/Navbar'
import { useAppConfig } from 'hooks/useAppConfig'
import { FormProvider } from 'hooks/useForm'
import { ResponseProvider } from 'hooks/useResponse'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Assessment } from './pages/Assessment'
import { Instructions } from './pages/Instructions'

export const App = () => {
	const { basename } = useAppConfig()
	return (
		<FormProvider>
			<ResponseProvider>
				<Router basename={basename}>
					<Navbar />
					<Routes>
						<Route index element={<Welcome />} />
						<Route path="/instructions" element={<Instructions />} />
						<Route path="/assessment" element={<Assessment />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/generator" element={<FormGenerator />} />
					</Routes>
				</Router>
			</ResponseProvider>
		</FormProvider>
	)
}
