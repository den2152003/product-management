// Hàm xử lý khi nhấn Chấp nhận
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accept");
    const userId = button.getAttribute("btn-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};

// Hàm xử lý khi nhấn Xóa (Từ chối)
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");
    const userId = button.getAttribute("btn-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};

// Lấy tất cả các box user
// Xử lý khi nhấn nút Kết bạn
const listBtnAdd = document.querySelectorAll("[btn-add-friend]");
if(listBtnAdd.length > 0) {
  listBtnAdd.forEach(button => {
    button.addEventListener("click", () => {
      // Tìm box-user cha gần nhất và thêm class 'add'
      button.closest(".box-user").classList.add("add");
      
      // Ở đây bạn có thể thêm logic gửi API lên server
      const userId = button.getAttribute("btn-add-friend");
      console.log("Đã gửi lời mời kết bạn tới:", userId);
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// end Xử lý khi nhấn nút Kết bạn

// Xử lý khi nhấn nút Hủy
const listBtnCancel = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancel.length > 0) {
  listBtnCancel.forEach(button => {
    button.addEventListener("click", () => {
      // Tìm box-user cha gần nhất và xóa class 'add'
      button.closest(".box-user").classList.remove("add");
      
      // Gửi API hủy lời mời nếu cần
      const userId = button.getAttribute("btn-cancel-friend");
      console.log("Đã hủy lời mời tới:", userId);
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// end Xử lý khi nhấn nút Hủy

// Chức năng Xóa (Từ chối kết bạn)
const listBtnRefuse = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuse.length > 0) {
  listBtnRefuse.forEach(button => {
    button.addEventListener("click", () => {
      // 1. Thêm class refuse để thay đổi giao diện (Hiện chữ "Đã xóa")
      button.closest(".box-user").classList.add("refuse");

      // 2. Lấy ID người gửi lời mời
      const userId = button.getAttribute("btn-refuse-friend");

      // 3. Gửi socket lên server
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// end Chức năng Xóa (Từ chối kết bạn)

// Chức năng Chấp nhận kết bạn
const listBtnAccept = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAccept.length > 0) {
  listBtnAccept.forEach(button => {
    acceptFriend(button);
  });
}
// end Chức năng Chấp nhận kết bạn

// Chức năng Hủy kết bạn
const listBtnUnfriend = document.querySelectorAll("[btn-unfriend]");
if(listBtnUnfriend.length > 0) {
  listBtnUnfriend.forEach(button => {
    refuseFriend(button);
  });
}

socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});


socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // data.userId là ID của bạn (người đang đăng nhập)
  // data.infoUserA là thông tin người vừa gửi lời mời cho bạn

  const myId = document.querySelector("[badge-users-accept]").getAttribute("badge-users-accept");

  if (myId === data.userId) {
    const container = document.querySelector(`[data-users-accept="${myId}"]`);
    if (container) {
      // 1. Tạo HTML cho box user mới
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);

      newBoxUser.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="${data.infoUserA.avatar || '/images/ava-default.png'}" alt="${data.infoUserA.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary mr-1 btn-accept-friend" btn-accept-friend="${data.infoUserA._id}">Chấp nhận</button>
              <button class="btn btn-sm btn-secondary btn-refuse-friend" btn-refuse-friend="${data.infoUserA._id}">Xóa</button>
              <button class="btn btn-sm btn-secondary btn-deleted-friend" btn-deleted-friend="${data.infoUserA._id}" disabled>Đã xóa</button>
              <button class="btn btn-sm btn-primary btn-accepted-friend" btn-accepted-friend="${data.infoUserA._id}" disabled>Đã chấp nhận</button>
            </div>
          </div>
        </div>
      `;

      // 2. Chèn vào danh sách
      container.appendChild(newBoxUser);

      // 3. QUAN TRỌNG: Phải gọi lại hàm gán sự kiện cho các nút mới này
      // Vì các nút này vừa được tạo ra, JS cũ chưa nhận diện được click
      refuseFriend(newBoxUser.querySelector(".btn-refuse-friend"));
      acceptFriend(newBoxUser.querySelector(".btn-accept-friend"));
    }
  }
});

// Lắng nghe sự kiện khi người kia HỦY lời mời kết bạn
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    // data.userIdB: ID của chính bạn
    // data.userIdA: ID của người vừa hủy lời mời

    // 1. Lấy ID của chính mình để xác nhận
    const myId = document.querySelector("[badge-users-accept]").getAttribute("badge-users-accept");

    if (myId === data.userIdB) {
        // 2. Tìm vùng chứa danh sách lời mời
        const container = document.querySelector(`[data-users-accept="${myId}"]`);
        
        if (container) {
            // 3. Tìm cái box của người A dựa trên attribute user-id mà ta đã đặt ở file Pug
            // Lưu ý: Thẻ col-6 của bạn nên có attribute [user-id=user.id]
            const boxUserDelete = container.querySelector(`[user-id="${data.userIdA}"]`);
            
            if (boxUserDelete) {
                // 4. Xóa box đó khỏi giao diện
                container.removeChild(boxUserDelete);
            }
        }
    }
});

// Lắng nghe sự kiện xóa user khỏi danh sách "Người dùng" khi họ gửi lời mời cho mình
socket.on("SERVER_RETURN_USER_ID_NOT_FRIEND", (data) => {
  const myId = document.querySelector("[badge-users-accept]").getAttribute("badge-users-accept");

  if (myId === data.userId) {
    // Tìm vùng chứa danh sách "Người dùng" (Not Friend)
    const container = document.querySelector(`[data-users-not-friend="${myId}"]`);
    if (container) {
      // Tìm box của người gửi (A) và xóa đi
      const boxUserDelete = container.querySelector(`[user-id="${data.infoUserA}"]`);
      if (boxUserDelete) {
        container.removeChild(boxUserDelete);
      }
    }
  }
});

// Lắng nghe sự kiện bạn bè Online
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
    const statusBox = document.querySelector(`.inner-status[user-id="${userId}"]`);
    if (statusBox) {
        statusBox.setAttribute("status", "online");
    }
});

// Lắng nghe sự kiện bạn bè Offline
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
    const statusBox = document.querySelector(`.inner-status[user-id="${userId}"]`);
    if (statusBox) {
        statusBox.setAttribute("status", "offline");
    }
});