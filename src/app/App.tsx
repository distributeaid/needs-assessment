import { AssessmentDone } from 'app//pages/AssessmentDone'
import { Assessment } from 'app/pages/Assessment'
import { Correction } from 'app/pages/Correction'
import { Export } from 'app/pages/Export'
import { FormGenerator } from 'app/pages/FormGenerator'
import { Instructions } from 'app/pages/Instructions'
import { Login } from 'app/pages/Login'
import { Privacy } from 'app/pages/Privacy'
import { Summary } from 'app/pages/Summary'
import { Welcome } from 'app/pages/Welcome'
import { AutoLogout } from 'components/AutoLogout'
import { Navbar } from 'components/Navbar'
import { RedirectFrom404 } from 'components/RedirectFrom404'
import { useAppConfig } from 'hooks/useAppConfig'
import { AuthProvider } from 'hooks/useAuth'
import { CorrectionProvider } from 'hooks/useCorrection'
import { FormProvider } from 'hooks/useForm'
import { LocalizationProvider } from 'hooks/useLocalization'
import { ResponseProvider } from 'hooks/useResponse'
import { StoredFormProvider } from 'hooks/useStoredForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

export const App = () => {
	const { basename } = useAppConfig()
	return (
		<AuthProvider>
			<LocalizationProvider>
				<FormProvider>
					<StoredFormProvider>
						<ResponseProvider>
							<CorrectionProvider>
								<Router basename={basename}>
									<Navbar />
									<Routes>
										<Route index element={<Welcome />} />
										<Route path="/instructions" element={<Instructions />} />
										<Route path="/assessment" element={<Assessment />} />
										<Route
											path="/assessment/done"
											element={<AssessmentDone />}
										/>
										<Route path="/privacy" element={<Privacy />} />
										<Route path="/generator" element={<FormGenerator />} />
										<Route path="/correction" element={<Correction />} />
										<Route path="/export" element={<Export />} />
										<Route path="/summary" element={<Summary />} />
										<Route path="/login" element={<Login />} />
									</Routes>
									<RedirectFrom404 />
									<AutoLogout />
								</Router>
							</CorrectionProvider>
						</ResponseProvider>
					</StoredFormProvider>
				</FormProvider>
			</LocalizationProvider>
		</AuthProvider>
	)
}
