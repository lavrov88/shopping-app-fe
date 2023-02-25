export const getRandom = (prefix = 'item') => {
	const dateNum = +new Date()
	const randNum = (Math.random()*10000).toFixed()
	return `${prefix}-${dateNum}-${randNum}`
}