 // search function to accept lower and majus and é==e bech ykoun search khir
export const searchFilter = (row, columnId, filterValue) => {
  const normalize = (str) =>
    String(str)
      .normalize('NFD')                  // decompose accents
      .replace(/[\u0300-\u036f]/g, '')  // remove accents
      .replace(/\s+/g, '')              // remove all spaces
      .toLowerCase();                   // lowercase

  const normalizedValue = normalize(row.getValue(columnId));
  const normalizedFilter = normalize(filterValue);

  return normalizedValue.includes(normalizedFilter);
};