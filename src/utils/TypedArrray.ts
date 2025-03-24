class TypedArray {
  public includes<T extends any[], E extends any>(
    array: T,
    element: E
  ): element is T[number] {
    return array.includes(element);
  }

  public isEmpty<T extends any[]>(array: T) {
    return Array.isArray(array) && array.length === 0;
  }
}

const instance = new TypedArray();

export default instance;
