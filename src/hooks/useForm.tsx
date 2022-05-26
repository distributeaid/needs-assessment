import {
	createContext,
	FunctionComponent,
	ReactNode,
	useContext,
	useState,
} from 'react'
import type { Form } from 'schema/types'

export const FormContext = createContext<{
	form?: Form
	setForm: (form: Form) => void
}>({
	setForm: () => undefined,
})

export const useForm = () => useContext(FormContext)

export const FormProvider: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const [form, setForm] = useState<Form>()

	return (
		<FormContext.Provider
			value={{
				form,
				setForm,
			}}
		>
			{children}
		</FormContext.Provider>
	)
}
