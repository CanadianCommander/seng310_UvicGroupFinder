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

pop_over_open = false;
function display_pop_over(target, type="1", parent=null){
  const pop_over_size = 400;

  if(pop_over_open)return;
  pop_over_open = true;
  $.ajax(`/pop_over/${type}?target=`+encodeURI(target),{
    method: "GET",
    complete: function (res, status){
      let pop_over = $($.parseHTML(res.responseText));
      let x = mouse_x - 10;
      let y = mouse_y - 10;
      if (x + pop_over_size > document.body.clientWidth)
      {
        x -= pop_over_size - 10;
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
      $(".pop_over")[0].my_parent = parent;
      pop_over.bind("mouseleave", (event) => {
        pop_over.css("opacity", "0.0");
        pop_over.bind("transitionend", (event) => {
          if ((pop_over.filter("div")).css("opacity") === "0") {
            pop_over.remove();
            pop_over_open = false;
          }
        });
      });
      pop_over.bind("mouseenter", (event) =>{
        pop_over.css("opacity", "1.0");
      })
    },
  });
}

function are_you_sure(element, s1, s2, s3){
  if($(element).text() === s1) {
    let new_e = element.cloneNode(true);
    $(new_e).html("<p>Back</p>");
    $(new_e).css("margin-left", "110px");
    $(new_e).css("width", "50px");
    $(element).html(s2);
    $(element).css("background-color", "#e67e22");
    $(element).css("border-color", "#e67e22");
    $(element).after($(new_e));
    $(new_e).on("click", () => {
      $(element).css("background-color", "#72B02D");
      $(element).css("border-color", "#72B02D");
      $(element).html(s1);
      $(new_e).remove();
    })
  }
  else if($(element).text() === s2){
    let group_box = $($(element).parent()[0].my_parent);
    if(group_box && group_box !== null){
      group_box.css("border-color", "#72B02D");
      group_box.find(".round_icon").attr("onclick","show_create_group()")
        .find("img").attr("src","images/cog.png");
      group_box.find(".members_lst").append($("" +
        "<div class='student' style=\"cursor:pointer\" onclick=\"display_pop_over(this.textContent)\">" +
        "<p style=\"display: inline-block;\"> User:" + user_id + " </p></div>"));
    }
    $(element).css("background-color", "#E6422E");
    $(element).css("border-color", "#E6422E");
    $(element).html(s3);
    $(element).next().remove();
  }
  else if($(element).text() === s3){
    $(element).css("background-color", "#72B02D");
    $(element).css("border-color", "#72B02D");
    $(element).html(s1);
  }
}

// SCREW IT
function are_you_sure2(element, s1, s2, s3, callback=null){
  if($(element).text() === s1) {
    let new_e = element.cloneNode(true);
    $(new_e).html("<p>Back</p>");
    $(new_e).css("margin-right", "120px");
    $(new_e).css("width", "50px");
    $(new_e).css("background-color", "#dfc026");
    $(new_e).css("border-color", "#dfc026");
    $(element).html("<p>" + s2 + '</p>');
    $(element).css("background-color", "#e67e22");
    $(element).css("border-color", "#e67e22");
    $(element).after($(new_e));
    $(new_e).on("click", () => {
      $(element).css("background-color", "#e67e22");
      $(element).css("border-color", "#e67e22");
      $(element).html("<p style='font-weight: 700;'>" + s1 + '</p>');
      $(new_e).remove();
    })
  }
  else if($(element).text() === s2){
    $(element).css("background-color", "#72B02D");
    $(element).css("border-color", "#72B02D");
    $(element).html("<p>" + s3 + '</p>');
    $(element).next().remove();
    $(element).css("cursor", "inherit");
    $(element).parent().css("opacity", "0.0");
    $(element).parent().css("border-color", "#72B02D");
    $(element).parent().one("transitionend", () => {
      $(element).parent().css('display', 'none');
      if(callback !== null){
        callback();
      }
    });
  }
}


function clear_default(ele){
  if(!ele.text_cleared) {
    $(ele).html('');
    ele.text_cleared = true;
  }
}