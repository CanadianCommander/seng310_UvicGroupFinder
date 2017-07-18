/**
 * Created by bbenetti on 2017-07-10.
 */
let mouse_x = 0;
let mouse_y = 0;

function init(){
  // change all check boxes to super cool switches !!!!!!!!!!!!!!
  let sw = $('.js-switch');
  for (let i =0; i < sw.length; i++){
    new Switchery(sw[0]);
  }
}

function add_group(txt="New Group", mb_l="")
{
  var group_container = document.getElementById("groups");
  first_child = group_container.firstElementChild;
  var new_child = first_child.cloneNode(true);
  new_child.style.display = "inline-block";

  // clear headers
  headers = new_child.getElementsByClassName("group_heading");
  for ( i = 0; i < headers.length; i += 1 )
  {
    headers[i].innerHTML = txt;
  }
  // clear member list
  var members = new_child.getElementsByClassName("members_lst");
  for ( i = 0; i < headers.length; i += 1 )
  {
    members[i].innerHTML = mb_l;
  }

  group_container.insertBefore(new_child, group_container.lastElementChild)
  return new_child;
}

function destroy_group(element){
  let parent = $(element.parentNode);
  parent.bind("transitionend", (event) => {
    //move members back to student list
    members = parent.find(".members_lst > .student");
    student_lst = $("#students");
    if (members !== undefined && student_lst !== undefined) {
      student_lst.append(members);
    }

    parent[0].parentNode.removeChild(parent[0])
  });
  $(parent).css('width', '0');
}


function student_highlight(element, b_on) {
  if (b_on)
  {
    element.style.setProperty("background-color","#e3e4f5");
    $(element).bind("transitionend", function(){
      if ($(element).css('background-color') === "rgb(227, 228, 245)" && element_in_drag === null){
        display_pop_over(element.textContent);
      }
    });
  }
  else
  {
    element.style.setProperty("background-color","#eeeeee");
  }
}
function student_info_save(){
    window.location.href = "projects/select";
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
  mouse_x = event.clientX;
  mouse_y = event.clientY;

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
      if (heading[0].textContent === "XYZ_hidden_XYZ"){
        continue;
      }
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


function show_submit(){
  let sub = $("#submit");
  sub.css('display', 'inherit');
}

function hide_submit(){
  let sub = $("#submit");
  sub.css('display', 'none');
}


function display_group_pop_over(group_box){
  let group_name = $(group_box).find('.group_heading');
  display_pop_over(group_name[0].textContent, "2", group_box);
}

function show_join_request(){
  $("#join_request").css("display", "inherit");
  $("#join_request").css("opacity", "1.0");
  $("#join_request").css("border-color", "#cecece");
  $("#join_request > .button").css("background-color", "#e67e22");
  $("#join_request > .button").css("border-color", "#e67e22");
  $("#join_request > .button").html("<p>Send</p>");
  let wtf = $("#join_request > div").not(".button");
  wtf.html("<p style=\"font-style: italic; color: darkGray;\"> write message here</p>");
  $("#join_request > div").not(".button")[0].text_cleared = undefined;
}

function hide_pop_up(ele, msg, bAlert=true){
  if($(ele).parent().find("div").not(".button").has("p").length === 0 && bAlert){
    if (confirm(msg)){
      ele.parentNode.style.display = 'none';
    }
  }
  else{
    ele.parentNode.style.display = 'none';
  }
}

function show_create_group(){
  $("#create_group_form").css("display","inherit");
  $("#create_group_form").css("opacity","1.0");
  $("#create_group_form").css("border-color","#cecece");
}


function student_group_add(group_c_form){
  let g_form = $(group_c_form);
  let new_group = add_group(g_form.find(".group_heading").html(),
    "<div class='student' style=\"cursor:pointer\" onclick=\"display_pop_over(this.textContent)\">" +
    "                                <p style=\"display: inline-block;\"> User:"+ user_id + " </p></div>");

  new_group = $(new_group);
  new_group.css("border-color", "#72B02D");
  new_group.find(".round_icon").attr("onclick","show_create_group()")
    .find("img").attr("src","images/cog.png");
  let c_group = $("#create_group_form");
  c_group.find(".button > p").html("Save").css("cursor","pointer").attr("onclick", 'hide_pop_up(this.parentNode,"",false)');
  c_group.find(".round_icon").attr("onclick", "hide_pop_up(this,'',false)");

  $(".group_box").has("[src='/images/add_group.png']").remove();
}