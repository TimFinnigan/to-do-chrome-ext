$(document).ready(function() {
  let defaultData = [
    {
      title: "Thing to do"
    }
  ];

  const editItem = function(e) {
    let editId = e.target.id;
    editId = editId.split("-");
    rowNum = editId[1];

    $("#item-" + rowNum).remove();
    $("#row-" + rowNum).append(
      "<i id='item-" + rowNum + "' class='far fa-save'></i>"
    );

    let title = $("#row-" + rowNum + " .title").text();

    $("#row-" + rowNum + " .title").empty();
    $("#row-" + rowNum + " .title").append(
      "<input spellcheck='false' id='edit-item' value='' maxlength='45'>"
    );

    $("#edit-item").val(title);
    $("#edit-item").focus();
    $("#edit-item").select();

    $(".fa-save").click(function() {
      updateListItem(rowNum);
    });

    $("#edit-item").keypress(function() {
      if (event.keyCode === 13) {
        updateListItem(rowNum);
      }
    });

    $("#edit-item").blur(function() {
      updateListItem(rowNum);
    });
  };

  const saveListOrder = function() {
    let newData = [];

    $("#sortable li").each(function(index) {
      let $this = $(this);
      newData.push({
        title: $this.find("span.title").text()
      });
    });

    localStorage.setItem("userData2", JSON.stringify(newData));
  };

  const updateListItem = function(rowNum) {
    let value = $("#edit-item").val();
    console.log(value.length);
    if (value.length === 0) {
      $("#item-" + rowNum).remove();
      saveListOrder();
    } else {
      $("#row-" + rowNum + " .title").text(value);
      $("#item-" + rowNum).remove();
      $("#row-" + rowNum).append(
        "<i id='item-" + rowNum + "' class='fa fa-pencil-square-o'></i>"
      );
      saveListOrder();
      $(".fa-pencil-square-o").click(function(e) {
        editItem(e);
      });
    }
    
  };

  const populateList = function(data) {
    $("#sortable").empty();
    let items = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].title === "") continue;
      items++;
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

      if (chrome.browserAction) {
        chrome.browserAction.setBadgeText({ text: String(items) });
      }
    }

    $(".fa-pencil-square-o").click(function(e) {
      editItem(e);
    });
  };

  // Begin process of adding data to display
  if (
    localStorage.getItem("userData2") &&
    localStorage.getItem("userData2") !== "[]"
  ) {
    let data = localStorage.getItem("userData2");
    populateList(JSON.parse(data));
  } else {
    localStorage.setItem("userData2", JSON.stringify(defaultData));
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

  const addNewItem = function() {
    let data = localStorage.getItem("userData2");
    data = JSON.parse(data);
    if (!data) data = [];
    data.push([]);
    populateList(data);
    $(".fa-pencil-square-o:last-child")
      .last()
      .trigger("click");
    $("#edit-item").val("Enter task here");
    $("#edit-item").select();
  };

  $("#add-item").click(function() {
    addNewItem();
  });

  // If enter is pressed then add new item
  // $(document).on("keypress", function(e) {
  //   if (e.which == "13") {
  //     addNewItem();
  //   }
  // });
});
