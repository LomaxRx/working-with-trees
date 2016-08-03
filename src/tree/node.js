export function Node(value,data){
  this.value = value;
  this.data = data;
  this.children = [];
  this.parent = null;
}

Node.prototype.find = function(value){
  var index;
  if( !this.children ) return index;
  for(var i=0; i<this.children.length;i++){
    if( value == this.children[i].value ){
      index = i;
      break;
    }
  }
  return index;
}

Node.prototype.remove = function(value){
  var i = this.find(value);
  if( !i ) throw new Error( 'No node with value ' + value + 'found on node ' + this.value );
  else return this.children.splice(i,1);
}
