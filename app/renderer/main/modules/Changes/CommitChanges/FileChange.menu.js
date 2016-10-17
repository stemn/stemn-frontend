export default (dispatch) => {
  return [{
    label: 'Discard Changes',
    onClick: (item)=>{console.log(item)},
  },{
    label: 'Open in explorer',
    onClick: (item)=>{console.log(item)},
  },{
    label: 'Open containing folder',
    onClick: (item)=>{console.log(item)},
  },{
    label: 'Open preview window',
    onClick: (item)=>{console.log(item);},
  }];
}
