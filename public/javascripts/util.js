/**
 * Created by bbenetti on 2017-07-12.
 */


function get_cookie(name){
  let cookies = document.cookie;
  let clist = cookies.split(";");
  for (let i = 0; i < clist.length; i ++){
    let key_value_pair = clist[i].trim();
    if (key_value_pair.indexOf(name) === 0){
      return key_value_pair.substr(name.length+1, key_value_pair.length);
    }
  }
  return null;
}


const NUM_UNDERSCORE = 20;
function append_random(text){
  let new_t = text;
  for (let i =0; i < NUM_UNDERSCORE; i++ ){
    new_t += "_";
  }
  new_t += Math.random();
  return new_t;
}

function remove_random(text){
  return text.replace(/_+\d+$/, "");
}