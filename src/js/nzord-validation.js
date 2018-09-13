
(function ( $ ) {
    /*
    *
    *
    */
    $.fn.validCpfCnpj = function(options){
        //Opções  
        var settings = $.extend({
            cpfOrCnpj: 'all', // cpf , cnpj
            removeMask :false
        }, options );

        var obj = $(this);
        obj.focusout(function() {
            var value = obj.val().replace(/\-|\.|\/|\(|\)| /g, "");
            
            if(settings.removeMask){
                obj.val(value);
                obj.inputmask('unmaskedvalue');
            }

            if(!$.isNumeric(value)){
                obj.closest('.form-group').addClass('has-error');
                obj.val('');
            }

            if(value.length <= 10 ){
                obj.val('');
            }else{

                if( value.length == 11 ){
                    var valida = ValidarCPF(value);
                    if( valida != true ){
                        obj.closest('.form-group').addClass('has-error');

                        obj.val('');
                        obj.focus();
                  
                        jsAlertBox('error','CPF Inválido!','Numero do CPF é Inválido!');
                    }else{
                        obj.closest('.form-group').removeClass('has-error');
                    }
                }
    
                if( value.length == 14 ){
                    var valida = ValidarCNPJ(value);
                    if( valida != true ){
                        obj.closest('.form-group').addClass('has-error');
                        obj.val('');
                        obj.focus();
        
                        jsAlertBox('error','CNPJ Inválido!','Numero do CNPJ é Inválido!');
                    }else{
                        obj.closest('.form-group').removeClass('has-error');
                    }
                }

                if( value.length >= 15 || value.length <= 10 ){
                    obj.closest('.form-group').addClass('has-error');
                    obj.val('');
        
                    jsAlertBox('error','Inválido!','Numero informado é Inválido!');
                }
            }
        });
    }

    function ValidarCNPJ(cnpj){
        if (cnpj.length != 14 || cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999")
            return false;

        var valida = new Array(6,5,4,3,2,9,8,7,6,5,4,3,2);
        var dig1= new Number;
        var dig2= new Number;
        
        exp = /\.|\-|\//g
        cnpj = cnpj.toString().replace( exp, "" ); 
        var digito = new Number(eval(cnpj.charAt(12)+cnpj.charAt(13)));
            
        for(i = 0; i<valida.length; i++){
            dig1 += (i>0? (cnpj.charAt(i-1)*valida[i]):0);	
            dig2 += cnpj.charAt(i)*valida[i];	
        }
        dig1 = (((dig1%11)<2)? 0:(11-(dig1%11)));
        dig2 = (((dig2%11)<2)? 0:(11-(dig2%11)));
        
        if(((dig1*10)+dig2) != digito){	
            return false;			
        }
        return true
    }

    function ValidarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,'');
        if(cpf == '') return false;
        // Elimina CPFs invalidos conhecidos
        if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
            return false;
        
        // Valida 1o digito
        add = 0;
        for (i=0; i < 9; i ++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
        
        // Valida 2o digito
        add = 0;
        for (i = 0; i < 10; i ++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;
            
        return true;   
    }

    $.fn.validPis = function(options){
        var obj = $(this);
        obj.focusout(function() {
            var ftap="3298765432";
            var total=0;
            var i;
            var resto=0;
            var numPIS=0;
            var strResto="";

            numPIS = obj.val();

            if ( numPIS=="" || numPIS == null){
                obj.closest('.form-group').addClass('has-error');

                obj.val('');
                return false;
            }	
            for(i=0;i<=9;i++){
                resultado = (numPIS.slice(i,i+1))*(ftap.slice(i,i+1));
                total=total+resultado;
            }

            resto = (total % 11)	
            if (resto != 0)	{
                resto=11-resto;
            }	
            if (resto==10 || resto==11)	{
                strResto=resto+"";
                resto = strResto.slice(1,2);
            }	
            if (resto!=(numPIS.slice(10,11))){
                obj.closest('.form-group').addClass('has-error');
                obj.val('');

                jsAlertBox('error','PIS Inválido!','Numero do PIS é Inválido!');
                return false;
            }

            obj.closest('.form-group').removeClass('has-error');
            return true;
        });
    }

}( jQuery ));