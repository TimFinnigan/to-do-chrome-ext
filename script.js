$(document).ready(function() {
  let defaultData = [
    {
      icon: "fa fa-github",
      title: "GitHub",
      url: "https://www.github.com"
    },
    {
      icon: "fa fa-stack-overflow",
      title: "Stack Overflow",
      url: "https://www.stackoverflow.com"
    },
    {
      icon: "fa fa-codepen",
      title: "CodePen",
      url: "https://www.codepen.io"
    },
    {
      icon: "fa fa-twitter",
      title: "Twitter",
      url: "https://www.stackoverflow.com"
    },
    {
      icon: "fa fa-hacker-news",
      title: "Hacker News",
      url: "https://news.ycombinator.com/"
    },
    {
      icon: "fa fa-reddit",
      title: "Reddit",
      url: "https://www.reddit.com"
    },
    {
      icon: "fa fa-jsfiddle",
      title: "JSFiddle",
      url: "https://www.jsfiddle.net"
    },
    {
      icon: "fa fa-dribbble",
      title: "Dribbble",
      url: "https://www.dribbble.com"
    }
  ];

  let editForm =
    "   <div id='edit-form'> " +
    "      <form> " +
    "        <div id='edit-labels'> " +
    "          <span>Title:</span> " +
    "          <span>URL:</span> " +
    "          <span>Icon:</span> " +
    "        </div> " +
    "        <div id='edit-inputs'> " +
    "          <span> " +
    "            <input id='edit-title' type='text' /> " +
    "          </span> " +
    "          <span> " +
    "            <input id='edit-url' type='text' /> " +
    "          </span> " +
    "          <span> " +
    "            <input id='edit-icon' type='text' /> " +
    "          </span> " +
    "        </div> " +
    "        <br /> " +
    "        <input id='save-button' type='submit' value='Save' /> " +
    "        <button id='delete-item'>Delete</button> " +
    "      </form> " +
    "    </div> ";

  const addIcons = function(data) {
    $(".modal-icons").empty();
    let row = 0; // 4 icons per row
    let count = 0;
    let itemsInRow = 0;

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (row === 0 || count % 4 === 0) {
        itemsInRow = 0;
        row++;
        $(".modal-icons").append(
          "<div class='flex-container row-" + row + "'></div>"
        );
      }

      count++;
      itemsInRow++;

      let icon = "<i class='" + item.icon + "'></i>";

      $(".row-" + row).append(
        "<div class='flex'><a href='" +
          item.url +
          "' target='_blank' title='" +
          item.title +
          "'>" +
          icon +
          "</a></div>"
      );
    }

    // If itemsInRow < 4, add blank items to fill up flexbox
    for (let i = 0; i < 4 - itemsInRow; i++) {
      $(".row-" + row).append("<div class='flex'></div>");
    }
  };

  const validateFields = function(url, icon) {
    if (!url || !icon) {
      alert("Please fill out out fields");
      return false;
    }
    if (!url.startsWith("http")) {
      alert("URL should start with http or https");
      return false;
    }
    if (!icon.startsWith("fa")) {
      alert("Font-Awesome icons should start with 'fa'");
      return false;
    }
  };

  const showEditForm = function(editForm, rowNum, addItem) {
    $("#form-container").append(editForm);
    if (addItem) {
      $("#delete-item").hide();
    } else {
      // Calculate position based on list element
      let offset = $("#row-" + rowNum).offset();
      $("#edit-form").css("top", offset.top - 25 + "px");
    }

    let rowData = [];
    $("#row-" + rowNum + " span").each(function(index) {
      rowData.push($(this)[0].innerText);
    });

    $("#edit-title").val(rowData[0]);
    $("#edit-url").val(rowData[1]);
    $("#edit-icon").val(rowData[2]);

    $("#edit-form form").submit(function(e) {
      e.preventDefault(); // prevent page refresh

      if (validateFields($("#edit-url").val(), $("#edit-icon").val()) === false) return false;

      let data = defaultData;

      if (
        localStorage.getItem("userData") &&
        localStorage.getItem("userData") !== "[]"
      ) {
        data = localStorage.getItem("userData");
        data = JSON.parse(data);
      }

      if (addItem) {
        rowNum = data.length;
        data.push([]);
      }

      data[rowNum].title = $("#edit-title").val();
      data[rowNum].url = $("#edit-url").val();
      data[rowNum].icon = $("#edit-icon").val();
      addIcons(data);
      populateList(data);
      saveListOrder();

      $("#edit-form").remove();
    });

    $("#delete-item").click(function(e) {
      e.preventDefault();

      let data = defaultData;

      if (
        localStorage.getItem("userData") &&
        localStorage.getItem("userData") !== "[]"
      ) {
        data = localStorage.getItem("userData");
        data = JSON.parse(data);
      }
      data.splice(rowNum, 1);
      addIcons(data);
      populateList(data);
      saveListOrder();

      $("#edit-form").remove();
    });
  };

  const populateList = function(data) {
    $("#sortable").empty();
    for (let i = 0; i < data.length; i++) {
      let listItem = "<li id='row-" + i + "'>";

      // add elements for url and icon values
      listItem += " <span class='title' >" + data[i].title + "</span> ";
      listItem += " <span class='url' hidden>" + data[i].url + "</span> ";
      listItem += " <span class='icon' hidden>" + data[i].icon + "</span> ";

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
      showEditForm(editForm, rowNum);
    });
  };

  const isValidJSONString = function(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      alert("Invalid JSON");
      return false;
    }
    return true;
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

    isValidJSONString(JSON.stringify(newData));

    localStorage.setItem("userData", JSON.stringify(newData));

    $(".flex-container").remove();
    addIcons(newData);
  };

  // Begin process of adding data to display
  if (
    localStorage.getItem("userData") &&
    localStorage.getItem("userData") !== "[]"
  ) {
    let data = localStorage.getItem("userData");
    addIcons(JSON.parse(data));
    populateList(JSON.parse(data));
  } else {
    addIcons(defaultData);
    populateList(defaultData);
    $("textarea").html(JSON.stringify(defaultData, null, 2));
  }

  $("#settings-icon").click(function() {
    $("#form-container").show();
  });

  $("#close-icon").click(function() {
    $("#form-container").hide();
  });

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
    showEditForm(editForm, null, true);
  });

  // Hide edit form when clicking outside of it
  $(document).mouseup(function(e) {
    var container = $("#edit-form");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.remove();
    }
  });
});
