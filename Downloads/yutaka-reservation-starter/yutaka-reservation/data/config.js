export const stores=[
  {id:'sasayama',name:'篠山店'},{id:'aioi',name:'三田相生店'},{id:'miwa',name:'三田三輪店'}
];
export const staff=[
  {id:'takeda',name:'武田',stores:['miwa','aioi']},
  {id:'kawakami',name:'川上',stores:['miwa']},
  {id:'teru',name:'テル',stores:['miwa','sasayama']},
  {id:'taniguchi',name:'谷口',stores:['sasayama','miwa']},
];
export const menus=[
  {id:'body60',name:'ボディケア 60分',minutes:60,price:5000},
  {id:'thai60',name:'タイ式 60分（お試し）',minutes:60,price:6000},
  {id:'foot40',name:'フットケア 40分',minutes:40,price:2700,store:'miwa'},
];
