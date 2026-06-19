let counter = 0;
export const genId = (prefix = "id") => `${prefix}-${++counter}`;
