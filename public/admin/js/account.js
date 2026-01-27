// Upload Image
const uploadImageInput = document.querySelector("[upload-image-input]");
const uploadImagePreview = document.querySelector("[upload-image-preview]");
if(uploadImageInput){
    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
}

// End Upload Image

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
            console.log(action);
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}
//End Change Status