$('#checkout').on('click', '#btn-payment', function() {
    let typePayment = $('input[name="type_payment"]:checked')
    let installment = $('select[name="installment"]').val();

    let cardNumber = $('#card_number').val();
    let expireDate = $('input[name="expire_date"]').val();
    let cardCvv = $('#card_cvv').val();
    let cardName = $('#card_name').val();
    let process = 0;

    // Validación Tipo de pago
    if(typePayment.length === 0 && installment === 'none'){
        $('#cnt_invalid_type_payment').removeClass('d-none');
    }else{
        $('#cnt_invalid_type_payment').addClass('d-none');
        process++;
    }

    // Validación Numero de tarjeta
    if(!cardNumber){
        $('#cnt_empty_card_number').removeClass('d-none');
    }else{
        $('#cnt_empty_card_number').addClass('d-none');
        let value = cardNumber.replace(/\s/g, "");
        if(!valid_credit_card(value)){
            $('#cnt_invalid_card_number').removeClass('d-none');
        }else{
            $('#cnt_invalid_card_number').addClass('d-none');
            process++;
        }
    }

    // Validación fecha de expiración
    if(expireDate === ''){
        $('#cnt_invalid_expire_date').html('Debes de ingresar la fecha de expiración');
        $('#cnt_invalid_expire_date').removeClass('d-none');
    }else{
        let month = parseInt(expireDate.substring(0,2));
        let newDate = new Date();
        let actualYear = newDate.getFullYear();
        let actualYear2 = actualYear.toString().slice(-2);
        let year = parseInt(expireDate.substring(3));
        if (month > 12 || expireDate.length != 5 || year < actualYear2){
            $('#cnt_invalid_expire_date').html('Debes de ingresar una fecha de expiración valida');
            $('#cnt_invalid_expire_date').removeClass('d-none');
        }else{
            $('#cnt_invalid_expire_date').addClass('d-none');
            process++;
        }
    }

    // Validación código de seguridad
    if(!cardCvv){
        $('#cnt_invalid_cvv').removeClass('d-none');
    }else{
        $('#cnt_invalid_cvv').addClass('d-none');
        process++;
    }

    // Validación nombre de tarjeta
    if(typeof cardName !== 'undefined'){
        if(!cardName){
            $('#cnt_invalid_card_name').removeClass('d-none');
        }else{
            $('#cnt_invalid_card_name').addClass('d-none');
            process++;
        }
    } else {
        process++;
    }

    // Validación de los campos dinámicos
    let dynamicInputs = Array.from($('.required'));
    dynamicInputs.forEach(input => {
        let inputName = $(input).data("name") 
        if($(input).val() === ''){
            $(`.invalid-${inputName}`).html('Debes de llenar el campo');
        }else{
            if($(input).attr('type') == 'email'){
                const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if(!regexCorreo.test($(input).val())){
                    $(`.invalid-${inputName}`).html('Debes de ingresar un correo valido');
                }
            }else{
                $(`.invalid-${inputName}`).html('');
            }
        }  
    });

    let process2 = true;
    dynamicInputs.forEach(input => {
        if($(input).val() === ''){
            process2 = false;
            return;
        }else{
            if($(input).attr('type') == 'email'){
                const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if(!regexCorreo.test($(input).val())){
                    process2 = false;
                    return;
                }
            }
        }
    });

    if(process == 5 && process2){
        let formData = new FormData();

        formData.append('token_',$('input[name="token_"]').val())
        formData.append('ebl_tl',$('input[name="ebl_tl"]').val())
        formData.append('ebl_te',$('input[name="ebl_te"]').val())
        formData.append('ebl_tn',$('input[name="ebl_tn"]').val())

        if(typePayment.length === 1){
            formData.append('type_payment', typePayment.val());
        } else {
            formData.append('type_payment', installment);
        }

        formData.append('card_number',cardNumber);
        formData.append('card_name',cardName);
        formData.append('card_expiration',expireDate);
        formData.append('card_cvv',cardCvv);

        let email = ($('#email').val() === undefined) ? '' : $('#email').val()
        let phone = ($('#phone').val() === undefined) ? '' : $('#phone').val()
        let address = ($('#address').val() === undefined) ? '' : $('#address').val()
        let nit = ($('#nit').val() === undefined) ? '' : $('#nit').val()
        let amount = ($('input[name="amount"]').val() === undefined) ? '' : $('input[name="amount"]').val()

        formData.append('email',email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('nit', nit);
        formData.append('amount', amount);

        let dnm = Array.from($('.dinamic-f'));
        dnm.forEach(input => {
            let name = $(input).attr("name");
            let sendProcess = true;
            if($(input).attr('type') == 'checkbox'){
                if($(input).prop('checked') == false){
                    sendProcess = false;
                }
            }
            if(sendProcess){
                formData.append(name,$(input).val());
            }
        });

        $('main input, main select').prop('disabled', 'true')

        $.ajax({
            type: 'POST',
            url: '/transaccion',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            beforeSend: function(){
                Swal.fire({
                    imageUrl: 'img/loader1.svg',
                    imageHeight: 250,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })
            },
            success: function(data){
                let code = data.code
                let token = data.token
                let authorization = data.authorization
                let reference = data.reference
                let audit = data.audit
                let amount = data.amount
                let redirect = data.redirect
                let urlSuccess = data.url_success
                let urlError = data.url_error
                let paymentButtonProcess = false
                
                if(data.status == 'success'){
                    if (redirect) {
                        if (urlSuccess) {
                            paymentButtonProcess = true
                        }
                    }
                    
                    if(paymentButtonProcess){
                        let formBpay = $('<form>', {
                            id : 'bpay-form',
                            name : 'bpay-form',
                            method : 'post',
                            action : urlSuccess
                        });
                        formBpay.css('display', 'none')
    
                        formBpay.append('token',token);
                        formBpay.append('reference',reference);
                        formBpay.append('audit',audit);
                        formBpay.append('code',code);
                        formBpay.append('amount',amount);
                        formBpay.append('authorization',authorization);
                        $('body').append(formBpay);
                        formBpay.submit()
                    } else {
                        Swal.fire({
                            title: 'Aprobada',
                            text: 'Por su seguridad esta plataforma de pago no almacenara ninguna información de su tarjeta, ni datos personales.',
                            icon: 'success',
                            showDenyButton: true,
                            denyButtonText: 'Descargar voucher',
                            showConfirmButton: false,
                            showCloseButton: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            preDeny: () => {
                                window.open('/transaccion/voucher','_blank');
                                return false
                            },
                            didDestroy: () => {
                                location.href = '/transaccion-aprobada'
                            }
                        }).then((result) => {
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                } else if(data.status == 'validate') {
                    if (redirect) {
                        if (urlSuccess) {
                            paymentButtonProcess = true
                        }
                    }
                    
                    if(paymentButtonProcess){
                        let formBpay = $('<form>', {
                            id : 'bpay-form',
                            name : 'bpay-form',
                            method : 'post',
                            action : urlSuccess
                        });
                        formBpay.css('display', 'none')
    
                        formBpay.append('token',token);
                        formBpay.append('reference',reference);
                        formBpay.append('audit',audit);
                        formBpay.append('code',code);
                        formBpay.append('amount',amount);
                        formBpay.append('authorization',authorization);
                        $('body').append(formBpay);
                        formBpay.submit()
                    } else {
                        Swal.fire({
                            title: 'Aprobada',
                            text: 'Por su seguridad esta plataforma de pago no almacenara ninguna información de su tarjeta, ni datos personales.',
                            icon: 'success',
                            showConfirmButton: true,
                            confirmButtonText: 'Confirmar número de autorización',
                            showDenyButton: true,
                            denyButtonText: 'Descargar voucher',
                            showCloseButton: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            preDeny: () => {
                                window.open('/transaccion/voucher','_blank');
                                return false
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    icon: 'question',
                                    title: 'Validación de autorización',
                                    input: 'text',
                                    inputLabel: 'Ingresa el número de autorización',
                                    inputAttributes: {
                                        autocapitalize: 'off'
                                    },
                                    inputValidator: (value) => {
                                        if (!value) {
                                            return 'El número de autorización es requerido'
                                        }
                                    },
                                    showConfirmButton: true,
                                    confirmButtonText: 'Verificar',
                                    showLoaderOnConfirm: true,
                                    showCloseButton: true,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    preConfirm: (auth) => {
                                        let bodyFormData = new FormData();
                                        bodyFormData.append('authorization', auth);
    
                                        $.ajax({
                                            type: 'POST',
                                            url: '/autorizacion/proceso',
                                            data: bodyFormData,
                                            dataType: 'json',
                                            contentType: false,
                                            processData: false,
                                            success: function(resAuth){
                                                console.log(resAuth)
                                                let status = resAuth.status
                                                let message = resAuth.message
                                                let attempts = resAuth.attempts
    
                                                if (attempts && status == 'error') {
                                                    Swal.showValidationMessage(message)
                                                } else {
                                                    if (status === 'success') {
                                                        alertCustom(status, 'Validación de autorización', message)
                                                        
                                                        setTimeout(function () {
                                                            location.href = '/autorizacion-aprobada'
                                                        }, 2500)
                                                    } else if (!attempts) {
                                                        alertCustom(status, 'Error', message)
                                                        
                                                        setTimeout(function () {
                                                            location.href = '/autorizacion-rechazada'
                                                        }, 2500)
                                                    }
                                                }
                                            }
                                        })
    
                                        return false
                                    },
                                }).then((response) => {
                                    if(response.isDismissed){
                                        location.href = '/transaccion-aprobada'
                                    }
                                })
                            } else if(result.isDismissed){
                                location.href = '/transaccion-aprobada'
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                } else if(data.status == 'c3ds_authentication'){
                    if(data.reasonCode != 'undefined'){
                        if(data.reasonCode == 100){
                            let iframe = $('<iframe>', {
                                id : 'ddc-iframe',
                                name : 'ddc-iframe',
                                height : 1,
                                width : 1
                            });
                            iframe.css('display', 'none')
        
                            let form = $('<form>', {
                                id : 'ddc-form',
                                name : 'ddc-form',
                                target : 'ddc-iframe',
                                method : 'post',
                                action : data.deviceDataCollectionURL
                            });
                            form.css('display', 'none')
        
                            let input = $('<input>', {
                                type: 'hidden',
                                name: 'JWT',
                                value: data.accessToken
                            });
        
                            form.append(input)
                            $('body').append(iframe);
                            $('body').append(form);
                            form.submit()
        
                            let form2 = $('<form>', {
                                id : 'ddc-form-2',
                                name : 'ddc-form-2',
                            });
        
                            $.each(data.data, (propName, propVal) => {
                                let input = $('<input>', {
                                    type: 'hidden',
                                    name: propName,
                                    value: propVal
                                });
        
                                form2.append(input)
                            })
        
                            $('body').append(form2);
                        }
                    } else {
                        alertCustom('error', 'C3DS STEP 1')
                    }
                } else {
                    if (redirect) {
                        if (urlError) {
                            paymentButtonProcess = true
                        }
                    }
                    
                    if(paymentButtonProcess){
                        let formBpay = $('<form>', {
                            id : 'bpay-form',
                            name : 'bpay-form',
                            method : 'post',
                            action : urlError
                        });
                        formBpay.css('display', 'none')
    
                        formBpay.append('token',token);
                        formBpay.append('reference',reference);
                        formBpay.append('audit',audit);
                        formBpay.append('code',code);
                        formBpay.append('amount',amount);
                        $('body').append(formBpay);
                        formBpay.submit()
                    } else {
                        Swal.fire({
                            title: 'Rechazada',
                            text: data.message,
                            icon: 'error',
                            showConfirmButton: true,
                            confirmButtonText: 'Volver a intentar',
                            showCloseButton: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then((result) => {
                            if(result.isDismissed){
                                location.reload()
                            } else if(result.isConfirmed){
                                location.reload()
                            }
                        })
                    }
                }
            }
        })
    }else{
        let frontCard2 = document.getElementById('front-card');
        document.documentElement.style.setProperty('--front-card-height',`${frontCard2.clientHeight}px`);
        $('#cnt-link').removeClass('div-color');
        $('#cnt-link').addClass('div-color');
    }
})