$(document).ready(function() {
  let defaultData = [
    {
      title: "Thing to do",
    }
  ];

  const populateList = function(data) {
    $("#sortable").empty();
    for (let i = 0; i < data.length; i++) {
      let listItem = "<li id='row-" + i + "'>";

      // add elements for url and icon values
      listItem += " <span class='title' >" + data[i].title + "</span> ";

      // Add unique IDs using index values
      let pencilIcon =
        "<i id='item-" +
        i +
        "' class='fa fa-pencil-square-o' aria-hidden='true'></li>";

      listItem += pencilIcon + "</li>";

      $("#sortable").append(listItem);
    }

    $(".fa-pencil-square-o").click(function(e) {
      let editId = e.target.id;
      editId = editId.split("-");
      rowNum = editId[1];

      $("#item-" + rowNum).removeClass("fa fa-pencil-square-o");
      $("#item-" + rowNum).addClass("far fa-save");

      let title = $("#row-" + rowNum + " .title").text();

      $("#row-" + rowNum + " .title").empty();
      $("#row-" + rowNum + " .title").append("<input id='edit-item' value=''>");

      $("#edit-item").val(title);
      $("#edit-item").focus();

      $("#edit-item").keyup(function() {
        let value = $("#edit-item").val();
        $(".fa-save").click(function(e) {
          $("#row-" + rowNum + " .title").text(value);
          $("#item-" + rowNum).removeClass("far fa-save");
          $("#item-" + rowNum).addClass("fa fa-pencil-square-o");
        });
      });

      // $("#edit-item").blur(function() {
      //   let newTitle = $("#edit-item").val();
      //   $("#row-" + rowNum + " .title").text(newTitle);
      // });
    });
  };

  const saveListOrder = function() {
    let newData = [];

    $("#sortable li").each(function(index) {
      let $this = $(this);
      newData.push({
        title: $this.find("span.title").text(),
        url: $this.find("span.url").text(),
        icon: $this.find("span.icon").text()
      });
    });

    localStorage.setItem("userData1", JSON.stringify(newData));
  };

  // Begin process of adding data to display
  if (
    localStorage.getItem("userData1") &&
    localStorage.getItem("userData1") !== "[]"
  ) {
    let data = localStorage.getItem("userData1");
    populateList(JSON.parse(data));
  } else {
    populateList(defaultData);
  }

  $("#sortable").sortable();
  $("#sortable").disableSelection();
  $("#sortable").sortable({
    stop: function(ui, event) {
      saveListOrder();
    }
  });

  $("#form-container").append(
    "<span id='add-item'><i class='fa fa-plus'></i>Add new item...</span>"
  );

  $("#add-item").click(function() {
    // add new row
    // put cursor in inputs
  });
  
});
