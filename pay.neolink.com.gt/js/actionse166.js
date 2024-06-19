let cardNumber = document.getElementById('card_number');
let requiredInputs = Array.from($('.required'));

cardNumber.addEventListener('keyup',function() {
    // Obtener el valor actual del input
    let inputValue = this.value;

    // Eliminar cualquier caracter que no sea un dígito
    inputValue = inputValue.replace(/\D/g, '');

    // Agregar espacios cada cuatro dígitos
    inputValue = inputValue.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Limitar la entrada a 23 caracteres
    if (inputValue.length > 23) {
        inputValue = inputValue.substring(0, 23);
    }

    // Establecer el valor formateado en el input
    cardNumber.value = inputValue;
})

function valid_credit_card(value) {
    let finalVal = false
    if(value.length >= 16){
        // Accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;

        // The Luhn Algorithm. It's so pretty.
        let nCheck = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

            nCheck += nDigit;
            bEven = !bEven;
        }

        finalVal = (nCheck % 10) == 0        
    }
    
    return finalVal;
}

function updateHeightCard() {
    let frontCard = document.getElementById('front-card');
    document.documentElement.style.setProperty('--front-card-height',`${frontCard.clientHeight}px`);
    $('#cnt-link').removeClass('div-color');
    $('#cnt-link').addClass('div-color'); 
}

$('#btn-switch-cards').click(function() {
    // Validación de los campos dinámicos
    let dynamicInputs2 = Array.from($('.front-card .required'));
    dynamicInputs2.forEach(input => {
        let inputName = $(input).attr("name") 
        if($(input).val() === ''){
            $(`.invalid-${inputName}`).html('Debes de llenar el campo');
        }else{
            $(`.invalid-${inputName}`).html('');
        }  
    });

    let dynamicInputs3 = Array.from($('.front-card .dinamic-f'));
    dynamicInputs3.forEach(input => {
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
    })

    let process3 = true;
    dynamicInputs2.forEach(input => {
        if($(input).val() === ''){
            process3 = false;
            return;
        }
    });

    dynamicInputs3.forEach(input => {
        if($(input).val() === ''){
            process3 = false;
            return;
        }else{
            if($(input).attr('type') == 'email'){
                const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if(!regexCorreo.test($(input).val())){
                    process3 = false;
                    return;
                }
            }
        }
    })

    if(process3){
        $('.front-card').hide(250);
        $('.back-card').show(250);
        $('.back-card').css('background',"url('img/b-side-2.png')")
    }
})

$('#btn-switch-cards-back').click(function() {
    $('.front-card').show(250);
    $('.back-card').hide(250);
})

$('select[name="installment"]').change(function() {
    $('input[name="type_payment"]').prop('checked',false);
    $('input[name="type_payment"]').attr('checked',false);
})

$('select[name="installment"]').change(function() {
    if($(this).val() == 'none'){
        $('#cnt_invalid_type_payment').removeClass('d-none');
    }else{
        $('#cnt_invalid_type_payment').addClass('d-none');
    }
})

$('input[name="type_payment"]').click(function() {
    if($(this).prop('checked')){
        $('#cnt_invalid_type_payment').addClass('d-none');
    }else{
        $('#cnt_invalid_type_payment').removeClass('d-none');
    }
})

$('input[name="type_payment"]').click(function() {
    $('select[name="installment"]').val("none");
})

requiredInputs.forEach(input => {
    let inputName = $(input).data("name") 
    let html = `<div class="invalid-feedback invalid-${inputName}"></div>`;
    $(input).parent().append(html);
});

$('.required').on('keyup',function() {
    let inputName = $(this).data('name');
    if($(this).val() === ''){
        $(`.invalid-${inputName}`).html('Debes de llenar el campo');
        updateHeightCard();
    }else{
        if($(this).attr('type') == 'email'){
            const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(!regexCorreo.test($(this).val())){
                $(`.invalid-${inputName}`).html('Debes de ingresar un correo valido');
            }else{
                $(`.invalid-${inputName}`).html('');
            }
        }else{
            $(`.invalid-${inputName}`).html('');
            updateHeightCard();
        }
    }
})

$('.required').on('change',function() {
    updateHeightCard();
})

$('#card_number').on('keyup',function() {
    if($(this).val() == ''){
        $('#cnt_empty_card_number').removeClass('d-none');
    }else{
        $('#cnt_empty_card_number').addClass('d-none');
        let value = $(this).val().replace(/\s/g, "");
        if(!valid_credit_card(value)){
            $('#cnt_invalid_card_number').removeClass('d-none');
        }else{
            $('#cnt_invalid_card_number').addClass('d-none');
        }
    }
})

$('#floatingMonth').on('change',function() {
    if($(this).val() == ''){
        $('#cnt_invalid_expire_date').removeClass('d-none');
    }else{
        $('#cnt_invalid_expire_date').addClass('d-none');
    }
})

$('#floatingYear').on('change',function() {
    if($(this).val() == ''){
        $('#cnt_invalid_expire_date').removeClass('d-none');
    }else{
        $('#cnt_invalid_expire_date').addClass('d-none');
    }
})

$('#card_cvv').on('keyup',function() {
    if($(this).val() == ''){
        $('#cnt_invalid_cvv').removeClass('d-none');
    }else{
        let value = $(this).val();
        // No permitir más de 4 caracteres
        if(value.length > 4 ){
            $(this).val(value.substring(0,4));
        }

        // Valores solo numéricos
        if(!/^\d+$/.test(value)){
            $(this).val(null);
            $('#cnt_invalid_cvv').removeClass('d-none');
        }else{
            $('#cnt_invalid_cvv').addClass('d-none');
        }
    }
})

$('#card_name').on('keyup',function() {
    if($(this).val() == ''){
        $('#cnt_invalid_card_name').removeClass('d-none');
    }else{
        $('#cnt_invalid_card_name').addClass('d-none');
    }
})

$('input[name="amount"]').on('input',function() {
    let value = $(this).val();
    value = value.replace(/[^0-9.]/g, ''); // Permite dígitos (0-9) y un punto decimal (.)
    if(value.length > 12){
        value = value.substring(0,12)
    }
    
    // Asegurémonos de que solo haya un punto decimal en el valor
    const decimalCount = (value.match(/\./g) || []).length;
    // console.log(decimalCount)
    if (decimalCount > 1) {
        value = '';
    }
    
    $(this).val(value);
})

$('input[name="expire_date"]').on('keyup',function() {
    let val = $(this).val();

    if(val == ''){
        $('#cnt_invalid_expire_date').html('Debes de ingresar la fecha de expiración');
        $('#cnt_invalid_expire_date').removeClass('d-none');
    }else{
        let month = parseInt(val.substring(0,2));
        let year = parseInt(val.substring(3));
        
        let date = new Date();
        
        let actualYear = date.getFullYear();
        let actualYear2 = actualYear.toString().slice(-2);
        
        if (month > 12 || val.length != 5 || year < actualYear2){
            $('#cnt_invalid_expire_date').html('Debes de ingresar una fecha de expiración valida');
            $('#cnt_invalid_expire_date').removeClass('d-none');
        }else{
            $('#cnt_invalid_expire_date').addClass('d-none');
        }
    }

    val = val.replace(/\D/g, '');
    
    if(val.length > 2){
        val = val.substring(0,2) + "/" + val.substring(2);
    }

    if(val.length > 5){
        val = val.substring(0,5);
    }

    $(this).val(val);
})

$(window).on('orientationchange',function() {
    updateHeightCard();
});

$(window).resize(function(params) {
    updateHeightCard();
})

$(document).ready(function(){
    updateHeightCard();
});