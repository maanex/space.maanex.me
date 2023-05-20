use('maanexspace');

// db.entities.dropIndex('pos_2d')
db.entities.createIndex(
  { pos: "2d" } ,
  { min : -2000000, max : 2000000, bits: 26 }
)
