export function selectTimelineItem(item) {
  console.log(item);
  return {
      type:'SELECT_TIMELINE_ITEM',
      payload: item
  }
}
