import { useState } from 'react'
import { withLocalStorage } from 'utils/withLocalStorage'

export const useCollapsed = (
	id: string,
): {
	collapsed: boolean
	toggle: () => void
} => {
	const storedCollapsed = withLocalStorage<boolean>({
		key: id,
		defaultValue: true,
	})

	const [collapsed, setCollapsed] = useState<boolean>(storedCollapsed.get())

	const toggle = () => {
		setCollapsed((collapsed) => {
			const state = !collapsed
			storedCollapsed.set(state)
			return state
		})
	}

	return {
		collapsed,
		toggle,
	}
}
