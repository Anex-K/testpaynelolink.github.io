window.addEventListener("message", (event) => {
    if (event.origin === listenPA1) {
        let data = JSON.parse(event.data);
        // console.log('Merchant received a message:', data);
        
        if (data !== undefined && data.Status) {
            // console.log('Songbird ran DF successfully');
            $('#ddc-iframe').remove()
            $('#ddc-form').remove()
            
            $.ajax({
                type: 'POST',
                url: '/3ds/enrolar',
                data: $('#ddc-form-2').serialize(),
                dataType: 'json',
                success: function (data) {
                    $('#ddc-form-2').remove()

                    if(data.reasonCode == 475){
                        let iframe = $('<iframe>', {
                            id : 'step-up-iframe',
                            name : 'step-up-iframe',
                        });
                        iframe.css({
                            'width' : data.iframeSize.width,
                            'height' : data.iframeSize.height,
                            'border' : 'none',
                        })
    
                        let form = $('<form>', {
                            id : 'step-up-form',
                            name : 'step-up-form',
                            target : 'step-up-iframe',
                            method : 'post',
                            action : data.stepUpUrl
                        });
                        form.css('display', 'none')
    
                        let input = $('<input>', {
                            type: 'hidden',
                            name: 'JWT',
                            value: data.accessToken
                        });
    
                        form.append(input)
                        $('body').append(form);

                        Swal.fire({
                            html: iframe,
                            width: data.containerSize.width,
                            heightAuto: true,
                            padding: '0.5rem',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            didOpen: Swal.showLoading(),
                        })
                        
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
                    } else{
                        let message = data.message
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
                        let $modal

                        if(data.status == 'success'){
                            if (redirect) {
                                if (urlSuccess) {
                                    paymentButtonProcess = true
                                }
                            }
        
                            if (paymentButtonProcess) {
                                $('form[name="formbpay"]').attr('action', urlSuccess)
                                $('form[name="formbpay"] input[name="token"]').val(token)
                                $('form[name="formbpay"] input[name="reference"]').val(reference)
                                $('form[name="formbpay"] input[name="audit"]').val(audit)
                                $('form[name="formbpay"] input[name="code"]').val(code)
                                $('form[name="formbpay"] input[name="amount"]').val(amount)
                                $('form[name="formbpay"] input[name="authorization"]').val(authorization)
                                document.formbpay.submit()
                            } else {
                                alertCustom('success', 'Aprobada', 'Aprobada')
                            }
                        } else if(data.status == 'error'){
                            if (redirect) {
                                if (urlError) {
                                    paymentButtonProcess = true
                                }
                            }
            
                            if (paymentButtonProcess) {
                                $('form[name="formbpay"]').attr('action', urlError)
                                $('form[name="formbpay"] input[name="token"]').val(token)
                                $('form[name="formbpay"] input[name="reference"]').val(reference)
                                $('form[name="formbpay"] input[name="audit"]').val(audit)
                                $('form[name="formbpay"] input[name="code"]').val(code)
                                $('form[name="formbpay"] input[name="amount"]').val(amount)
                                document.formbpay.submit()
                            } else {
                                alertCustom('error', 'Rechazada', 'Rechazada')
                            }
                        }
                    }
                }
            })
        }
    }

    if(event.origin == listenPA2){
        let data = JSON.parse(event.data);
        // console.log('Merchant received a message:', data);
        
        if(data.status == 1){
            $.ajax({
                type: 'POST',
                url: '/3ds/autenticacion',
                data: $('#ddc-form-2').serialize(),
                dataType: 'json',
                success: function (data) {
                    let message = data.message
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
                    let $modal
                    
                    $('#ddc-form-2').remove()
                    $('#step-up-form').remove()
                    $('#step-up-iframe').remove()
                    Swal.showLoading()
                    setTimeout(Swal.close(), 500)

                    if(data.status == 'success'){
                        if (redirect) {
                            if (urlSuccess) {
                                paymentButtonProcess = true
                            }
                        }
    
                        if (paymentButtonProcess) {
                            $('form[name="formbpay"]').attr('action', urlSuccess)
                            $('form[name="formbpay"] input[name="token"]').val(token)
                            $('form[name="formbpay"] input[name="reference"]').val(reference)
                            $('form[name="formbpay"] input[name="audit"]').val(audit)
                            $('form[name="formbpay"] input[name="code"]').val(code)
                            $('form[name="formbpay"] input[name="amount"]').val(amount)
                            $('form[name="formbpay"] input[name="authorization"]').val(authorization)
                            document.formbpay.submit()
                        } else {
                            alertCustom('success', 'Aprobada', 'Aprobada')
                        }
                    } else if(data.status == 'error') {
                        if (redirect) {
                            if (urlError) {
                                paymentButtonProcess = true
                            }
                        }
        
                        if (paymentButtonProcess) {
                            $('form[name="formbpay"]').attr('action', urlError)
                            $('form[name="formbpay"] input[name="token"]').val(token)
                            $('form[name="formbpay"] input[name="reference"]').val(reference)
                            $('form[name="formbpay"] input[name="audit"]').val(audit)
                            $('form[name="formbpay"] input[name="code"]').val(code)
                            $('form[name="formbpay"] input[name="amount"]').val(amount)
                            document.formbpay.submit()
                        } else {
                            alertCustom('error', 'Rechazada', 'Rechazada')
                        }
                    }
                }
            })
        }
    }

}, false);