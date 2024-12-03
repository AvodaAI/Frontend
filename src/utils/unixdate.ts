export const formatUnixDate = (unixDate: number | null | undefined) => {
  if (unixDate === null || unixDate === undefined) return 'N/A';
  const date = new Date(unixDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  return date
}
