// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");

if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-roles");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có muốn xóa không?");

            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;

                formDeleteItem.submit();
            }

        })
    })
}
// End Delete Item

// permission
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
    const button = document.querySelector("[button-submit]");

    button.addEventListener("click", () => {
        const permission = [];

        const row = tablePermission.querySelectorAll("[data-name]");

        row.forEach(row => {
            const name = row.getAttribute("data-name");
            const input = row.querySelectorAll("input");

            if (name == "id") {
                input.forEach(input => {
                    const id = input.value;
                    permission.push({
                        id: id,
                        permission: []
                    });
                })
            } else {
                input.forEach((input, index) => {
                    const checked = input.checked;
                    // console.log(name);
                    // console.log(checked);
                    // console.log("-----------");
                    if (checked)
                        permission[index].permission.push(name);
                })
            }

        })
        console.log(permission);

        if (permission.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permission);
            formChangePermissions.submit();
        }
    });
}
// end permission

// permission data default
const dataRecords = document.querySelector("[data-records]");

if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermission = document.querySelector("[table-permissions]");

    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            const row = tablePermission.querySelector(`[data-name="${permission}"]`);
            if (row) {
                const inputs = row.querySelectorAll("input");
                if (inputs[index]) {
                    inputs[index].checked = true;
                }
            }
        })
    })
}
// end permission data default