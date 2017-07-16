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