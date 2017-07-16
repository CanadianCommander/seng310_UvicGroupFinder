/**
 * Created by bbenetti on 2017-07-12.
 */

function load_cookie(){
  const old_id = get_cookie("user_id");
  if (old_id !== null) {
    user_id = old_id;//export user id to all files
  }
  else{
    const new_id = Math.random();
    document.cookie = "user_id=" + new_id + ";path=/;";
    user_id = new_id;//export user id to all files
  }
}
load_cookie();


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

function display_pop_over(item){
  const pop_over_size = 400;

  $.ajax("/pop_over/1?target="+encodeURI(item.textContent),{
    method: "GET",
    complete: function (res, status){
      let pop_over = $($.parseHTML(res.responseText));
      let x = mouse_x;
      let y = mouse_y;
      if (x + pop_over_size > document.body.clientWidth)
      {
        x -= pop_over_size;
        if(y + pop_over_size > document.body.clientHeight){
          y -= pop_over_size;
        }
      }
      else{
        if(y + pop_over_size > document.body.clientHeight){
          y -= pop_over_size;
        }
      }
      pop_over.css("left", x + "px");
      pop_over.css("top", y + "px");
      pop_over.css("width", pop_over_size);
      pop_over.css("height", pop_over_size);
      $(document.body).append(pop_over);
    },
  });
  $(item).bind("mouseout", (event) => {
    let pop_overs = $('.pop_over');
    pop_overs.css("opacity", "0.0");
    pop_overs.bind("transitionend", (event) => pop_overs.remove());
  });
}