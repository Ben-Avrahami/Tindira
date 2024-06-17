const monthDifference = (startDate: string, endDate: string) => {
  const from = new Date(startDate)
  const to = new Date(endDate)
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    to.getMonth() -
    from.getMonth() +
    (to.getDate() - from.getDate()) / 30
  )
}

export const calculatePrices = (
  price: number,
  contractStartDate: string,
  contractEndDate: string,
  isPricePerWholeTime: boolean
) => {
  const durationMonths = monthDifference(contractStartDate, contractEndDate)

  if (isPricePerWholeTime === true) {
    return [Math.floor(price / durationMonths), Math.floor(price)]
  } else {
    return [Math.floor(price), Math.floor(durationMonths * price)]
  }
}

export const formatDate = (isoDate: Date): string => {
  return isoDate.toISOString().split('T')[0]
}
