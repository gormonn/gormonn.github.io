export function sorter(field, direction) {
  // "return data vs return data.slice(0).sort(()=>0)"
  // https://jsfiddle.net/t2asrh0k/5/
  // Intl.Collator() - вцелом медленнее обыной функции сортировки,
  // однако позволяет корректно сортировать товары на других языках
  // Наименования товаров в задании на Русском языке, поэтому буду
  // придерживаться данной функции (bench https://jsfiddle.net/3hcwvy6p/9/)

  if (!field || !direction) {
    return false;
    // return () => 0;
  }
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base"
  });
  switch (direction) {
    case "asc":
      return (a, b) => collator.compare(a[field], b[field]);
    case "desc":
      return (a, b) => collator.compare(b[field], a[field]);
    case "default":
    default:
      return false;
    // return () => 0; // порядок не меняет, однако производительность на порядок ниже
  }
}
