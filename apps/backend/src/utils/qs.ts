const VALID_FILTER_OPERANDS = ['equals', 'lt', 'lte', 'gt', 'gte', 'contains', 'startsWith', 'endsWith'];

// TODO: Refactor?

// TODO: We should coerce the value to the correct type. To do that,
// we can require a zod schema as a second argument and let zod handle that cases.
export function queryToPrismaWhere(qs: string[]) {
  const filterRegex = /(.*?)\[(.*?)\]\[(.*?)\]/;

  const filters = qs
    .map((f) => {
      const result = filterRegex.exec(f);
      if (!result) return null;

      const [_, field, operand, value] = result;
      if (!field || !operand || !value) return null;
      if (field === '' || operand === '') return null;
      if (!VALID_FILTER_OPERANDS.includes(operand)) return null;

      return {
        field: result[1],
        operand: result[2],
        value: result[3],
      };
    })
    .filter(Boolean);

  const where = filters.reduce<Record<string, { [operand: string]: string }>>((acc, curr) => {
    if (acc[curr.field]) {
      acc[curr.field][curr.operand] = curr.value;
      return acc;
    }

    acc[curr.field] = {
      [curr.operand]: curr.value,
    };

    return acc;
  }, {});

  if (Object.keys(where).length === 0) return undefined;
  return where;
}

export function queryToPrismaSort(qs: string[]) {
  const filterRegex = /(.*?)\[(asc|desc?)\]/;

  const filters = qs
    .map((f) => {
      const result = filterRegex.exec(f);
      if (!result) return null;

      return {
        field: result[1],
        direction: result[2],
      };
    })
    .filter(Boolean);

  const sort = filters.reduce<Record<string, 'asc' | 'desc'>>((acc, curr) => {
    acc[curr.field] = curr.direction as 'asc' | 'desc';
    return acc;
  }, {});

  if (Object.keys(sort).length === 0) return [];
  return sort;
}
