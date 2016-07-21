export function assignAll(items, property, value) {
  return items.map((item)=>{
    return {...item,
      [property]: value
    }
  })
}
