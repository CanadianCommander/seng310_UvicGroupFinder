/**
 * Created by bbenetti on 2017-07-15.
 */

function add_project(add_button){
  let project_list = $('#plist');
  let projects = project_list.find('.project');
  let new_project = $(projects[0].cloneNode(true));
  (new_project.find('p')).html("New Group Project");
  new_project.css('display', 'inline-block');
  $(add_button).before(new_project);
}

function open_project(element, bStudent){
  let proj_name = ($(element).parent().find("p"))[0].textContent;

  if(bStudent){
    if(proj_name === "SENG 310 Main Project"){
      //hack hack hack
      $(location).attr("href", "/join_group?name=" + proj_name +"&foo=true");
    }
    else {
      $(location).attr("href", "/join_group?name=" + proj_name);
    }
  }
  else{
    //teacher
    $(location).attr("href", "/?name="+proj_name);
  }
}