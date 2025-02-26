import { JSDOM } from 'jsdom'
import { TrustPilotData } from './types'

// Constants for CSS selectors
const SELECTORS = {
	reviewsContainer: '#business-unit-title span',
	scoreElement: 'p[data-rating-typography]',
	imageElement: 'a[name="business-unit-header-profile-image"] picture img',
}

//  validate URL
function validateUrl(url: string): void {
	try {
		const parsedUrl = new URL(url)
		if (!parsedUrl.hostname.endsWith('trustpilot.com')) {
			throw new Error(`The URL does not belong to the Trustpilot domain: ${url}`)
		}
	} catch {
		throw new Error(`Invalid URL: ${url}`)
	}
}

// Extract reviews and rating text
function extractReviews(document: Document): { totalReviews: number; reviewsRate: string } {
	const reviewsContainer = document.querySelectorAll(SELECTORS.reviewsContainer)[2]?.textContent
	if (!reviewsContainer) {
		throw new Error('Unable to find reviews container')
	}
	const [reviewsNumber, reviewsRate] = reviewsContainer.split('•').map(item => item.trim())
	const totalReviews = parseInt(reviewsNumber.replace(',', ''), 10)

	if (isNaN(totalReviews)) {
		throw new Error('Failed to parse total reviews count')
	}

	return { totalReviews, reviewsRate }
}

// Extract score
function extractScore(document: Document): number {
	const scoreElement = document.querySelector(SELECTORS.scoreElement)
	if (!scoreElement || !scoreElement.textContent) {
		throw new Error('Unable to find score element')
	}

	const score = parseFloat(scoreElement.textContent.trim())

	if (isNaN(score)) {
		throw new Error('Failed to parse score value')
	}

	return score
}

// Extract image URL
function extractImageUrl(document: Document): string {
	const imageContainer = document.querySelector(SELECTORS.imageElement)
	if (!imageContainer) {
		throw new Error('Profile image container not found')
	}

	const imageUrl = imageContainer.getAttribute('src')
	if (!imageUrl) {
		throw new Error('Profile image URL not found')
	}

	return imageUrl
}

async function fetchData(url: string): Promise<string | undefined> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.text();
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

export async function scrapeTrustPilot(trustPilotUrl: string): Promise<TrustPilotData> {
	try {
		validateUrl(trustPilotUrl)

		const res = await fetchData(trustPilotUrl)
		const dom = new JSDOM(res)
		const document = dom.window.document

		// Extract data
		const { totalReviews, reviewsRate } = extractReviews(document)
		const score = extractScore(document)
		const imageUrl = extractImageUrl(document)

		return { totalReviews, reviewsRate, score, imageUrl }
	} catch (error) {
		const errorMessage =
			error instanceof Error ? `Error scraping Trustpilot URL "${trustPilotUrl}": ${error.message}` : 'An unknown error occurred while scraping Trustpilot'
		console.error(errorMessage)
		throw error
	}
}
