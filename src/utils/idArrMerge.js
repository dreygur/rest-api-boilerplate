export default function idArrMerge(main, update) {
  return [...new Set(
    [
      ...(main || []).map(e => e.toString()),
      ...(update.add || [])
    ].filter(e => !(update.remove || []).includes(e))
  )];
}