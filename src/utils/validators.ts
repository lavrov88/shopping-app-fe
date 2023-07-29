export const required = (value: string) => !!value || 'This field is required'

export const hasLengthCreator = (from: number, to?: number) => {
  return (value: string) => {
    if (from && to) {
      return (value.length >= from && value.length <= to) || `Length should be between ${from} and ${to} symbols`
    } else {
      return value.length >= from || `Length should be at least ${from} symbols`
    }
  }
}

export const matchesValueCreator = (failMessage?: string) => {
  return (input: string, valueToCompare: string) => {
    return input === valueToCompare || failMessage || 'This fields does not match'
  }
}

export const notMatchesValueCreator = (failMessage?: string) => {
  return (input: string, valueToCompare: string) => {
    return input !== valueToCompare || failMessage || 'This fields should not match'
  }
}