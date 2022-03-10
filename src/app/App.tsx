import { AssessmentDone } from 'app//pages/AssessmentDone'
import { Assessment } from 'app/pages/Assessment'
import { Export } from 'app/pages/Export'
import { FormGenerator } from 'app/pages/FormGenerator'
import { Instructions } from 'app/pages/Instructions'
import { Privacy } from 'app/pages/Privacy'
import { Welcome } from 'app/pages/Welcome'
import { Navbar } from 'components/Navbar'
import { RedirectFrom404 } from 'components/RedirectFrom404'
import { useAppConfig } from 'hooks/useAppConfig'
import { FormProvider } from 'hooks/useForm'
import { ResponseProvider } from 'hooks/useResponse'
import { StoredFormProvider } from 'hooks/useStoredForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

export const App = () => {
	const { basename } = useAppConfig()
	return (
		<FormProvider>
			<StoredFormProvider>
				<ResponseProvider>
					<Router basename={basename}>
						<Navbar />
						<Routes>
							<Route index element={<Welcome />} />
							<Route path="/instructions" element={<Instructions />} />
							<Route path="/assessment" element={<Assessment />} />
							<Route path="/assessment/done" element={<AssessmentDone />} />
							<Route path="/privacy" element={<Privacy />} />
							<Route path="/generator" element={<FormGenerator />} />
							<Route path="/export" element={<Export />} />
						</Routes>
						<RedirectFrom404 />
					</Router>
				</ResponseProvider>
			</StoredFormProvider>
		</FormProvider>
	)
}
