export const removeItemAtIndex = (arr: any[], i: number) => [
  ...arr.slice(0, i),
  ...arr.slice(i + 1, arr.length),
];

export const addItemAtIndex = (arr: any[], i: number, item: any) => [
  ...arr.slice(0, i),
  item,
  ...arr.slice(i, arr.length),
];

export const moveItem = (arr: any[], i: number, j: number) =>
  addItemAtIndex(removeItemAtIndex(arr, i), j, arr[i]);

export const shuffle = (arr: any[]) => {
  const a = [...arr]; // makes a copy of arr cus it shuffles in place and we may want to avoid directly mutating our original arr
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};
