export default class Cache<
	Key extends string | number,
	Value,
	FallbackArgs extends unknown[] = []
> {
	private readonly data = {} as Record<Key, Value>

	constructor(
		private readonly fallback: (
			key: Key,
			...args: FallbackArgs
		) => Promise<Value>
	) {}

	readonly get = async (key: Key, ...args: FallbackArgs) =>
		Object.prototype.hasOwnProperty.call(this.data, key)
			? this.data[key]
			: (this.data[key] = await this.fallback(key, ...args))
}
