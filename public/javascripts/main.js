/**
 * Created by bbenetti on 2017-07-10.
 */

function load_cookie(){
  const old_id = get_cookie("user_id");
  if (old_id !== null) {
    user_id = old_id;//export user id to all files
  }
  else{
    const new_id = Math.random();
    document.cookie = "user_id=" + new_id + ";";
    user_id = new_id;//export user id to all files
  }
}

function add_group()
{
  var group_container = document.getElementById("groups");
  first_child = group_container.firstElementChild;
  var new_child = first_child.cloneNode(true);

  // clear headers
  headers = new_child.getElementsByClassName("group_heading");
  for ( i = 0; i < headers.length; i += 1 )
  {
    headers[i].innerHTML = "New Group";
  }
  // clear member list
  var members = new_child.getElementsByClassName("members_lst");
  for ( i = 0; i < headers.length; i += 1 )
  {
    members[i].innerHTML = "";
  }

  group_container.insertBefore(new_child, group_container.lastElementChild)
}


function student_highlight(element, b_on) {
  if (b_on)
  {
    element.style.setProperty("background-color","#e3e4f5");
  }
  else
  {
    element.style.setProperty("background-color","#eeeeee");
  }
}

element_in_drag = null;
element_drag_style = null;

function drag(element, b_drag, event)
{
  if(b_drag)
  {
    element_in_drag = element;
    element_drag_style = element.style.cssText;
    set_selection(false);
    document.body.style.setProperty("cursor","all-scroll");
  }
  else if (element_in_drag !== null)
  {
    //try to drop in to group
    element_in_drag.style.cssText = element_drag_style;
    var res = drop_to_group_lst(element_in_drag, event);
    if (res)
    {
      element_in_drag.remove();
    }


    element_in_drag = null;
    set_selection(true);
    document.body.style.removeProperty("cursor");
  }
  else if (splitter_in_drag !== null )
  {
    splitter_in_drag = null;
    set_selection(true);
  }
}

function update_drag(event)
{
  if(element_in_drag !== null)
  {
    element_in_drag.style.setProperty("position", "fixed");
    element_in_drag.style.setProperty("left", (event.clientX - 150) + "px");
    element_in_drag.style.setProperty("top", (event.clientY - 15) + "px");
    element_in_drag.style.setProperty("width", "275px");
    element_in_drag.style.setProperty("height", "25px")
  }
  else if (splitter_in_drag !== null)
  {
    update_splitter(event);
  }
}

function set_selection(b_sel)
{
  select = "none";
  if (b_sel)
  {
    select = "text"
  }
  document.body.style.setProperty("-webkit-user-select",select);
  document.body.style.setProperty("-moz-user-select",select);
  document.body.style.setProperty("-ms-user-select",select);
  document.body.style.setProperty("user-select",select);

}


function drop_to_group_lst(element,event)
{
  //get drop target
  element.style.visibility = "hidden";
  var drop_target = document.elementFromPoint(event.clientX,event.clientY);
  element.style.visibility = "visible";

  // drop
  if (drop_target.className === "members_lst" || drop_target.id === "students")
  {
    child = element.cloneNode(true);
    student_highlight(child,false);
    drop_target.appendChild(child);
    return true;
  }
  else if(drop_target.className === "student" || drop_target.tagName === "P")
  {// we are dropping on a student / text. There may be a list underneath it!
    drop_target.style.visibility = "hidden";
    res = drop_to_group_lst(element,event);
    drop_target.style.visibility = "visible";
    return res;
  }
  return false;
}

splitter_in_drag = null;
function start_split_adjust(event, splitter)
{
  splitter_in_drag = splitter;
  set_selection(false);
}

function update_splitter(event)
{
  var group_area = document.getElementById("groups");
  var student_area = document.getElementById("students");

  group_area.style.right = (document.body.clientWidth - event.clientX + 20) + "px";
  student_area.style.minWidth = (document.body.clientWidth - event.clientX - 5) + "px";
  splitter_in_drag.style.right = (document.body.clientWidth - event.clientX ) + "px";
}

function save_groups()
{
  // inspect DOM and extract group info.
  let group_dic = {};
  let groups = $(".group_box");
  for( let i = 0; i < groups.length; i += 1) {
    let student_list = $(".members_lst > .student > p",groups[i]);
    let heading = $("h3",groups[i]);

    if (heading[0] !== undefined) {
      let heading_text = heading[0].textContent;
      if(heading_text in group_dic){
        // already in dictionary append to name so we can insert.
        heading_text = append_random(heading_text);
      }
      group_dic[heading_text] = [];
      for (let z = 0; z < student_list.length; z += 1) {
        group_dic[heading_text].push(student_list[z].textContent);
      }
    }
  }

  let unassigned_students = $("#students").find(".student > p");
  group_dic["xy_unassigned_42"] = [];
  for (let i =0; i < unassigned_students.length; i ++ ){
    group_dic["xy_unassigned_42"].push(unassigned_students[i].innerHTML);
  }


  // format data in to json request
  let req_data = "{";
  for (let key in group_dic){
    let students = group_dic[key];

    req_data += `"${key}"\:[`;
    for (let i = 0; i < students.length; i ++){
      const name = students[i];
      req_data += `"${name}"`;
      if (i + 1 < students.length)
      {
        req_data += ",";
      }
    }
    req_data += "],"
  }

  //remove trailing comma
  req_data += `"user_id":"${user_id}"`;
  req_data += "}";
  // send data to db for save
  $.ajax("/api/save_groups",{
    contentType:'application/json',
    method: "POST",
    complete: function (res, status){
      if (status === "success"){
        let sv_prog = $('#save_prog');
        sv_prog.attr("src", "images/check.png");
        sv_prog.css("width", "25px");
        sv_prog.css("height", "25px");
        sv_prog.css("cursor", "inherit");
        sv_prog.bind("transitionend", (event) => sv_prog.css("opacity", "0.0"));

      }
    },
    data: req_data
  });

  let sv_prog = $('#save_prog');
  sv_prog.css("opacity","1.0");
  sv_prog.css("cursor","wait");
}



