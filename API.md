# memorize.ai API

## Where to find your API key

<img
	src="https://storage.googleapis.com/file-in.appspot.com/files/XeTXzcNpuK.png"
	alt="Where to find your API key"
	width="400"
/>

Click **"My API key"** at the bottom. Your API key must be included in every request.

## Base URL

```
https://memorize.ai/_api/{method}
```

## Methods

### `user`

#### Query Parameters

- `key` (required) Your API key
- `id` (required) The user's ID

#### Response

- `id: string` The user's ID
- `name: string` The user's name
- `interests: string[]` The users' interests. An array of topic IDs.
- `decks: number` The number of decks this user has
- `all_decks: string[]` All the decks this user has ever owned, even deleted ones. An array of deck IDs.

### `deck`

#### Query Parameters

- `key` (required) Your API key
- `id` (required) The deck's ID

or

- `key` (required) Your API key
- `short_id` (required) The deck's short ID. Can be found in the URL
	- `/d/{short_id}/...`

#### Response

- `id: string`
- `short_id: string`
- `slug: string` Shortened version of the name
- `url: string`
- `topics: string[]` Array of topic IDs
- `has_image: boolean`
- `image_url: string`
- `name: string`
- `subtitle: string`
- `description: string`
- `ratings: object`
	- `average: number`
	- `total: number`
	- `individual: number[5]`
		- `number` 1 star ratings
		- `number` 2 star ratings
		- `number` 3 star ratings
		- `number` 4 star ratings
		- `number` 5 star ratings
- `downloads: number`
- `cards: number`
- `unsectioned_cards: number`
- `current_users: number`
- `all_time_users: number`
- `favorites: number`
- `creator_id: string`
- `date_created: number` Milliseconds since 1970
- `date_last_updated: number` Milliseconds since 1970

### `section`

#### Query Parameters

- `key` (required) Your API key
- `deck_id` (required) The deck's ID
- `section_id` (optional) The section's ID
- `limit` (optional) The limit on how many sections should be returned

#### Response

If the `section_id` is specified, a single section is returned. Otherwise, an array of sections is returned.

- `id: string`
- `name: string`
- `cards: number` The number of cards the section contains

### `card`

#### Query Parameters

- `key` (required) Your API key
- `deck_id` (required) The deck's ID
- `section_id` (optional) The section's ID
- `card_id` (optional) The card's ID
- `limit` (optional) The limit on how many cards should be returned

#### Response

If the `card` is specified, a single card is returned. Otherwise, an array of cards is returned.

You can filter what cards should be returned by specifying the `section_id`.

- `id: string`
- `section_id: string | null` If null, the card is unsectioned
- `front: string`
- `back: string`

### `topic`

#### Query Parameters

- `key` (required) Your API key
- `id` (required) The topic's ID

or

- `key` (required) Your API key
- `name` (required) The topic's name

or

- `key` (required) Your API key
- `category` (required) The topic's category

or

- `key` (required) Your API key

#### Response

If no query parameters are sent, all an array of all topics are returned.

If the `category` is specified, an array of topics is returned containing all topics that are filed under that category.

Otherwise, a single topic is returned.

- `id: string`
- `name: string`
- `category: string`
