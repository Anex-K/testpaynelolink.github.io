function alertCustom(status = 'error', title = 'Error', message = 'Ha ocurrido un problema') {
    Swal.fire({
        title: title,
        text: message,
        icon: status,
        showCancelButton: false,
        showConfirmButton: false,
        showCloseButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: 3500
    }).then((result) => {
        if(result.isDismissed){
            location.reload()
        }
    })
}