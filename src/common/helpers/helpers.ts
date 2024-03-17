export function getDataWithDateAsNumber<T>(data: Omit<T, 'createdAt'| 'updatedAt'> & { createdAt: Date, updatedAt: Date }): Omit<T, 'createdAt'| 'updatedAt'> & { createdAt: number, updatedAt: number } {
  return {
    ...data,
    createdAt: new Date(data?.createdAt).getTime(),
    updatedAt: new Date(data?.updatedAt).getTime(),
  };
}

export function getDataWithDateAsDate<T>(data: Omit<T, 'createdAt'| 'updatedAt'> & { createdAt: number, updatedAt: number }): Omit<T, 'createdAt'| 'updatedAt'> & { createdAt: Date, updatedAt: Date } {
  return {
    ...data,
    createdAt: new Date(data?.createdAt),
    updatedAt: new Date(data?.updatedAt),
  };
}
