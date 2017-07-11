/**
 * Created by bbenetti on 2017-07-10.
 */


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
    element.style.setProperty("background-color","#f5f5f5");
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
  else if(drop_target.className === "student")
  {// we are dropping on a student. There may be a list underneath it!
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