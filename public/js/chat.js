// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".inner-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;

    if (content) {
      // Gửi nội dung tin nhắn lên server
      socket.emit("CLIENT_SEND_MESSAGE", content);
      
      // Xóa nội dung trong input sau khi gửi
      e.target.elements.content.value = "";

      socket.emit("CLIENT_SEND_TYPING", "hide");
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    console.log(data);
    const myId = document.querySelector(".chat").getAttribute("my-id");
    const bodyChat = document.querySelector(".inner-body");
    const boxTyping = document.querySelector(".inner-list-typing")
    

  const div = document.createElement("div");
  
//   // Kiểm tra xem tin nhắn là của mình hay của người khác
  if (data.userId == myId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    // Thêm tên người gửi nếu là tin nhắn đến
    const htmlName = `<div class="inner-name">${data.fullName}</div>`;
    div.innerHTML = htmlName;
  }

  // Thêm nội dung tin nhắn
  const htmlContent = `<div class="inner-content">${data.content}</div>`;
  div.innerHTML += htmlContent;

  bodyChat.insertBefore(div, boxTyping);

//   // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  bodyChat.scrollTop = bodyChat.scrollHeight;
});
// End SERVER_RETURN_MESSAGE

// Scroll Chat to Bottom (Chạy lần đầu khi load trang)
const bodyChat = document.querySelector(".inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// --- Xử lý Emoji Picker Element ---
const emojiPicker = document.querySelector('emoji-picker');
const buttonEmoji = document.querySelector('.button-emoji');
const listEmoji = document.querySelector('.inner-list-emoji');

if (emojiPicker) {
  const inputChat = document.querySelector("input[name='content']");

  // Lắng nghe sự kiện click vào icon (Đúng như ảnh bạn gửi)
  emojiPicker.addEventListener('emoji-click', event => {
    const emoji = event.detail.unicode;
    inputChat.value += emoji;
    inputChat.focus();
  });

  // Xử lý Bật/Tắt bảng chọn khi bấm nút mặt cười
  buttonEmoji.onclick = (e) => {
    e.stopPropagation(); // Tránh bị đóng ngay lập tức do sự kiện click ngoài
    listEmoji.classList.toggle("d-none");
  };

  // Click ra ngoài thì đóng bảng emoji
  document.addEventListener("click", (e) => {
    if (!listEmoji.contains(e.target) && e.target !== buttonEmoji) {
      listEmoji.classList.add("d-none");
    }
  });
}


// --- Xử lý Hiệu ứng Typing ---
const inputChat = document.querySelector(".inner-form input[name='content']");

if (inputChat) {
  let typingTimeout;

  inputChat.addEventListener("keyup", () => {
    // 1. Gửi tín hiệu "show" lên server khi người dùng gõ phím
    socket.emit("CLIENT_SEND_TYPING", "show");

    // 2. Nếu sau 3 giây không gõ tiếp, gửi tín hiệu "hide" để ẩn typing
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hide");
    }, 3000);
  });
}

// Lắng nghe tín hiệu từ Server để hiển thị/ẩn typing của người khác
const elementListTyping = document.querySelector(".inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      // Kiểm tra xem đã có box typing của người này chưa (tránh hiện lặp lại)
      const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      
      if (!existTyping) {
        const bodyChat = document.querySelector(".inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("inner-incoming");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-content">
            <div class="inner-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        `;

        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight; // Cuộn xuống để người dùng thấy
      }
    } else {
      // Nếu type là "hide", tìm và xóa box typing của người đó
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}

