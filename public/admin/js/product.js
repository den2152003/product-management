const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

// Change Status
if (buttonChangeStatus.length > 0)
{
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path")
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const statusCurrent = button.getAttribute("data-status");

            const id = button.getAttribute("data-id");

            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}
//End Change Status

// Delete Item

const buttonDelete = document.querySelectorAll("[button-delete]");

if(buttonDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có muốn xóa không?");
            
            if(isConfirm){
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
            
        })
    })
}
// End Delete Item
