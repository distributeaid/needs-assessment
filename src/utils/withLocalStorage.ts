type Freezer<T> = {
	freeze: (unfrozen: T) => string
	unfreeze: (frozen: string) => T
}

type WithLocalStorage = {
	<T>(_: { key: string; freezer?: Freezer<T> }): {
		set: (_: T) => void
		get: () => T | undefined
		destroy: () => void
	}
	<T>(_: { key: string; defaultValue: T; freezer?: Freezer<T> }): {
		set: (_: T) => void
		get: () => T
		destroy: () => void
	}
}

export const withLocalStorage: WithLocalStorage = <T>({
	key,
	defaultValue,
	freezer,
}: {
	key: string
	defaultValue?: T
	freezer?: Freezer<T>
}): {
	set: (_?: T) => void
	get: () => T | undefined
	destroy: () => void
} => {
	const destroy = () => localStorage.removeItem(key)
	return {
		set: (v) => {
			if (v === undefined) destroy()
			localStorage.setItem(key, (freezer?.freeze ?? JSON.stringify)(v))
		},
		get: () => {
			const stored = localStorage.getItem(key)
			if (stored === null) return defaultValue
			try {
				return (freezer?.unfreeze ?? JSON.parse)(stored) as T
			} catch {
				console.error(
					`[withLocalStorage] Failed to load stored entry for ${key} from ${stored}!`,
				)
				return defaultValue
			}
		},
		destroy,
	}
}

export const dateFreezer: Freezer<Date> = {
	freeze: (d) => d.toISOString(),
	unfreeze: (s) => new Date(s),
}
