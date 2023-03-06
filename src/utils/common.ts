import { PurchaseItem } from "../stores/listsStore"

export const getRandom = (prefix = 'item') => {
	const dateNum = +new Date()
	const randNum = (Math.random()*10000).toFixed()
	return `${prefix}-${dateNum}-${randNum}`
}

// PURCHASES

export const getIdsSortedAccordingToChecked = (items: PurchaseItem[]) => {
  return [ ...items ]
    .sort((a, b) => {
      if (a.checked && !b.checked) return 1
      if (!a.checked && b.checked) return -1
      return a.sortRate < b.sortRate ? -1 : 1
    })
    .map(item => item.id)
}

export const sortPurchasesWithIdsArray = (a: PurchaseItem, b: PurchaseItem, sortedIds: string[]) => {
  const aIndex = sortedIds.findIndex(id => id === a.id)
  const bIndex = sortedIds.findIndex(id => id === b.id)
  return aIndex - bIndex
}