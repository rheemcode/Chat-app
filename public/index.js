const socket = io();

// const loadUserName = async () => {
//   try {
//     let username = await fetch("/get_username", { method: "GET" });
//     username = await fetch("get_username");
//     console.log(username);
//     username = await username.json();
//     console.log(username);
//     return username["username"];
//   } catch (e) {}
// };

const loadUserName = async () => {
  try {
    return await fetch("/get_username")
      .then(async (response) => {
        return await response.json();
      })
      .then(async (text) => {
        console.log(text["username"]);
        return text;
      });
  } catch (e) {}
};

const loadMessages = async () => {
  try {
    return await fetch("/get_messages")
      .then(async (response) => {
        return await response.json();
      })
      .then((message) => {
        return message;
      });
  } catch (e) {
    console.log(e);
  }
};

const addMessage = async (msg, scroll) => {
  if (msg["username"]) {
    let username = await loadUserName();
    if (msg["time"]) {
      var date = moment(msg["time"]).fromNow();
    } else {
      var date = moment(Date.now()).fromNow();
    }

    var content =
      '<div class="container">' +
      '<b style="color:#000" class="right">' +
      msg["username"] +
      "</b><p>" +
      msg["message"] +
      '</p><span class="time-right">' +
      date +
      "</span></div>";
    if (username == msg["username"]) {
      content =
        '<div class="container darker">' +
        '<b style="color:#000" class="left">' +
        msg["username"] +
        "</b><p>" +
        msg["username"] +
        '</p><span class="time-left">' +
        date +
        "</span></div>";
    }
    // messageDiv.
    let messageDiv = document.getElementById("messages");
    messageDiv.innerHTML += content;
  }

  if (scroll) {
    scrollToBottom("messages");
  }
};

const scrollToBottom = (id) => {
  var div = document.getElementById(id);
  $("#" + id).animate(
    {
      scrollTop: div.scrollHeight - div.clientHeight,
    },
    500
  );
};

socket.on("connect", async () => {
  let username = await loadUserName();
  if (username) {
    username = username["username"];
    socket.emit("event", {
      message: username + " just connected to the server",
      connect: true,
    });
  }
  $("form#msgForm").on("submit", async (e) => {
    e.preventDefault();

    let msgInput = $("#msg");
    let userInput = msgInput.val();
    let username = await loadUserName();
    username = username["username"];
    msgInput.val("");
    console.log(userInput);
    socket.emit("event", {
      username: username,
      message: userInput,
    });
  });
});

socket.on("disconnect", async (msg) => {
  let username = await loadUserName();
  socket.emit("event", {
    message: username + " Just left the server...",
  });
});

socket.on("message recieved", (msg) => {
  addMessage(msg, true);
});

// executed when the DOM has finished loading
$(function () {
  $(".msgs").css({ height: $(window).height() * 0.7 + "px" });
  $(window).on("resize", () => {
    $(".msgs").css({ height: $(window).height() * 0.7 + "px" });
  });
});

window.onload = async () => {
  console.log("window loaded");
  let messages = await loadMessages();
  messages = messages[0];
  for (i = 0; i < messages.length; i++) {
    let scroll = false;
    // console.log(messages[i]);
    if (i == messages.length - 1) {
      scroll = true;
    }
    console.log(messages.length);
    console.log(messages[0]);
    addMessage(messages[i], scroll);
  }

  let username = await loadUserName();
  if (username) {
    $("#login").hide();
  } else {
    $("#logout").hide();
  }
};
