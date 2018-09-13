jQuery( document ).ready(function( $ ) {
    //TODO do something or delete this.
	getMensagem();
	Pace.restart();
	checkSessao($('#sesId').val(),$('#urlPag').val());
});

function onExitModal(){
	Pace.restart();
}

setInterval(function() {
	var hoje = new Date();
	hora = hoje.getHours();
	if(hora<=9){
		hora = "0" + hora;
	}
	minutos = hoje.getMinutes();
	if(minutos<=9){
		minutos = "0" + minutos;
	}    
	$("#clock-wrapper").html( [hora, minutos].join(':') );	
	getMensagem();
	checkSessao($('#sesId').val(),$('#urlPag').val());
	Pace.restart();
}, 10000);

function getMensagem(){
	$.ajax({
	  url: $('#urlBase').val()+'/app/system/mensagem/getMsgs',
	  cache: false
	}).done(function( data ) {
	  $("#navBarMsg").html( data );
	});
}

function validSelect(){
    if( $('input[name="checkbox1"]:checked').length == 1 ){
    	return $('input[name="checkbox1"]:checked').val();
    }else{    	
    	if( $('tr.selected td:nth-child(1)').text() != ''){
    		return $('tr.selected td:nth-child(1)').text();;
    	}else{
    		jsAlertBox('info','Selecione!','Selecione 1 (um) item da Listagem!');
			return false;
    	}
    }
}

function openKCFinder(field) {
    window.KCFinder = {
        callBack: function(url) {
            field.value = url;
            window.KCFinder = null;
        }
    };
    window.open(''+$('#urlBase').val()+'/libs/kcfinder/browse.php?type=images&lang=pt-br', 'kcfinder_textbox',
        'status=0, toolbar=0, location=0, menubar=0, directories=0, ' +
        'resizable=1, scrollbars=0, width=800, height=600'
    );
}

function CKupdate(){
    for ( instance in CKEDITOR.instances )
        CKEDITOR.instances[instance].updateElement();
}

function sysAction(url,params,idParam){
	var urlFinal = url;
	if( idParam ){
		if( validSelect() == false ){
			return false;
		}
		var id = validSelect();
		urlFinal = urlFinal + '/' + id;

	}

	if(params){
		urlFinal = urlFinal+'?'+$.param(params);
	}

	location.href = urlFinal
}
function sysModalBoxJs(title,url,data,nome,size,modal=true,exitDef=true){
	var name = nome;
	var urlFinal = url;
	
	if( data == true ){
		if( validSelect() == false ){
			return false;
		}
		var idMov = validSelect();
		var urlFinal = url + '/' + idMov;
	}

	if( nome != 'undefined' ){
		nome = 'name="'+nome+'"';
	}
	
	if(size == undefined ) {
		size = " modal-lg";
	} else if(size == 'sm'){
		size = " modal-sm";
	} else {
		size = "";
	}
	
	var box = $.now();
	var onModalHide = function() {
		$('#modalBox'+box).remove();
	};

	var arq = url.split('?');
	var html = '<div class="modal fade" id="modalBox'+box+'" '+nome+' role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-keyboard="false" data-backdrop="static">';
		
	html+= '<div class="modal-dialog'+size+'">'+
			'<div class="panel panel-default modal-content">'+
				'<div class="panel-heading">'+
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				'<h4><b>'+title+'</b>  <em><small class="text-right">['+urlFinal+']</small></em></h4></div>'+
					'<div class="row modal-body" style="padding-top:0px; padding-bottom:0px;">'+
					'<div id="mdlBoxPreloader_'+name+'" class="text-center"><img src="'+$('#urlBase').val()+'/images/Preloader_3.gif" width="64" height="64"><br> Carregando...</div>'+
					'<div id="mdlBoxDetail_'+name+'" style="display:none;padding-top:10px;">'+
			'</div></div></div>'+
			'</div>'+
			'</div>';

	$('#divModalBox').append( html );
	$('#modalBox'+box).modal('show');
	
	var url = $('#urlBase').val() + '/' + urlFinal;
	if( modal == true ){
		url = $('#urlBase').val() + '/modal?p=' + urlFinal
	}

	//Carrega html modal 
	$('#mdlBoxDetail_'+name).load(url,function(response, status, xhr){
		$('#mdlBoxPreloader_'+name).hide();
		$('#mdlBoxDetail_'+name).show();
	});
	
	$('#modalBox'+box).on('hidden.bs.modal', function (e,data) {
		$('#modalBox'+box).remove();

		if( exitDef == true ){
			onExitModal(data);
		}else{
			var fn = window[exitDef];
			if (typeof fn === "function") fn(data);
		}
		
		setTimeout($.unblockUI, 2000);
	});
}

function loadDetailBoxJs(name,url){
	setTimeout( function() { $('#mdlBoxDetail_'+name).load( url )},800);
}

function sysModalBox(title,url,data,alerta,nome){
	if( data == true ){
		if( validSelect() == false ){
			return false;
		}
		var idMov =  validSelect();
		var urlFinal = url + '/' + idMov;
	}else{
		var urlFinal = url;
	}

	if( alerta != 'undefined' ){
		alerta = 'alert alert-'+alerta;
	}

	if( nome != 'undefined' ){
		nome = 'name="'+nome+'" id="'+nome+'"';
	}	

	var html = '<div class="modal fade" id="modalBox" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-keyboard="false" data-backdrop="static">'+
					'<div class="modal-dialog modal-lg">'+
						'<div class="modal-content">'+
							'<div class="modal-header ' + alerta + '">'+
								'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
								'	<span aria-hidden="true">&times;</span>'+
								'</button><h4><b>'+title+'</b></h4>'+
							'</div>'+
							'<div class="row modal-body" id="modalBoxDetalhe">'+
								'<div class="col-xs-12 text-center" id="loadingModal"><br><br><img src="'+$('#urlBase').val()+'/images/Preloader_3.gif" width="64" height="64"></div>'+
								'<iframe src="' + $('#urlBase').val() + '/' + urlFinal + '" '+nome+' width="100%" height="600" style="border: none;" onload="jaCarregado()"></iframe>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';

	$('#divModalBox').append( html );
	$('#modalBox').modal('show');

	//$('#modalBoxDetalhe').load( urlFinal + "&embedded=true");

	$('#modalBox').on('hidden.bs.modal', function (e) {
		$('#modalBox').remove();
	});	
}

function jaCarregado(){
	$("#loadingModal").hide().delay( 800 );
}

function jsMensageBox(tipo,size,title,msg,delay,width){
	// tipo = "error", "info", "success", "warning"
	if (width != null) {
		widt = 'width: width,';
	}else{
		widt = '';
	}
	Lobibox.notify(tipo, {
		size: size,
		howClass: 'rollIn',
		hideClass: 'rollOut',
		title: title,
		delay: delay,
		icon: true,
		position: 'bottom left',
		msg: msg,
	});
}
 
function jsAlertBox(tipo,title,msg){
	Lobibox.alert(tipo, {
		title: title,
		icon: true,
		msg: msg,
	});
}

function jsConfirmBox(title,msg){
	var defer = $.Deferred();

	Lobibox.confirm({
		title: title,
		msg: msg,
		buttons: {
			yes: { 'class': 'lobibox-btn lobibox-btn-yes', text: 'SIM', closeOnClick: true },
			no: { 'class': 'lobibox-btn lobibox-btn-no', text: 'NÃO', closeOnClick: true }
		},
		closeButton: false,
		callback: function ($this, type) {
			if (type === 'yes') {
				// Resolve the deferred
				defer.resolve();
			}else{
				defer.reject();
			}
		}
	});	
	
	return defer;
}

function jsAlertBoxUrl(tipo,title,msg,url){
// tipo = "error", "info", "success", "warning"	
	$('#divBoxUrl').load(url, '');
	Lobibox.alert(tipo, {
		title: title,
		icon: true,
		msg: msg,
	});
}

function msgInfoBox(tipo,msg){
	if( tipo === 'null' ){
		tipo = 'default';
	}
	Lobibox.notify(tipo, {
		size: 'mini',
		sound:false,
        /*rounded: true,*/
        delayIndicator: true,
        delay: 8000,
        msg: msg
    });
}

/**	Função para slvar no banco */
function jqSaveModal(form,url,name){
	$('button[type=submit]', $('#' + form)).attr('disabled', 'disabled');
	
	var frm = document.getElementById(form);
	var file = $('#' + form+' input:file').prop('files');
	var dados = new FormData(frm); 
	
	if( file ){
		dados.append('file',file );
	}

	$.ajax({
		type: 'post',
		url: url,
		enctype: 'multipart/form-data',
		dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
		data: dados,
		success: function(data){

			var response = JSON.parse(data);
			if( data == 1){
				msgInfoBox('success','Movimentação salva com Sucesso!');
				
				if(name) hideModalData(name,data);
			}else if(response){	
				if(response.statusCode == 201 || response.statusCode == 200){
					msgInfoBox('success',response.message);
					if(name) hideModalData(name,response);

				}else if(response.statusCode == 400 || response.statusCode == 401){
					msgInfoBox('warning',response.message);

					if(name) hideModalData(name,response);
				}else{
					jsAlertBox('error','Erro ao salvar',response.message);
				}
			}else{
				jsAlertBox('error','Erro ao salvar',data.message);
			}
			//Chama evento afterSubmit
			$('#' + form).trigger('afterSubmit',response);

			$('button[type=submit]','#'+ form).removeAttr("disabled");
		},
	    error: function(xhr, ajaxOptions, thrownError) {
			if(xhr.status == 400){
				var response = JSON.parse(xhr.responseText);
				var errors = getListError(response.message);
				jsAlertBox('error','Erro ao salvar',errors);
			}else{
				console.log(thrownError + "\r\n" + xhr.statusText + "\r\n");
				var response = JSON.parse(xhr.responseText);
				if(response.error){
					jsAlertBox('error','Erro ao salvar',response.message+"<pre style='width: 482px;height: 200px;'>"+response.error+"</pre>");
				}else{
					jsAlertBox('error','Erro ao salvar',response.message);
				}
			}
			$('button[type=submit]','#'+ form).removeAttr("disabled");
	    }
	});
}

/**	Função para slvar no banco */
function jqSave(url,dados){
	var defer = $.Deferred();

	$.ajax({
		type: 'post',
		url: url,
		dataType: 'json',
        cache: false,
		data: dados,
		success: function(response){
			if(response.statusCode == 201 || response.statusCode == 200){
				msgInfoBox('success',response.message);
			}else if(response.statusCode == 400 || response.statusCode == 401){
				msgInfoBox('warning',response.message);
			}else{
				jsAlertBox('error','Erro ao salvar',response.message);
			}
			
			defer.resolve(response);
		},
	    error: function(xhr, ajaxOptions, thrownError) {
			if(xhr.status == 400){
				var response = JSON.parse(xhr.responseText);
				var errors = getListError(response.message);
				jsAlertBox('error','Erro ao salvar',errors);
			}else{
				console.log(thrownError + '\r\n' + xhr.statusText + '\r\n');
				var response = JSON.parse(xhr.responseText);
				if(response.error){
					jsAlertBox('error','Erro ao salvar',response.message+"<pre style='width: 482px;height: 200px;'>"+response.error+"</pre>");
				}else{
					jsAlertBox('error','Erro ao salvar',response.message);
				}
			}

			defer.reject(xhr);
	    }
	});

	return defer;
}

function hideModalData(name,data){
	$('.modal-backdrop').remove();
	$('body').removeClass('modal-open');
	$('div[name=' + name + ']').trigger( "hidden.bs.modal",[data] );
}

/**	Função para slvar no banco */
function jqSaveDados(url,name,dados){	
	$('button[type=submit]', $(this)).attr('disabled', 'disabled');
	$.ajax({
		type: 'post',
		url: url,
		data: dados,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
		success: function(data){
			if( data == 1 ){
				msgInfoBox('success','Movimentação salva com Sucesso!');
				$('div[name=' + name + ']').modal('hide');
				return true;
			}else{
				jsAlertBox('error','Erro ao salvar',data);
				return false;
			}
			$('button[type=submit]', $(this)).attr('disabled', 'false');
		}
	});	
	return true;	
}

function printDiv(divId) {
	/*document.getElementsByClassName('table').style.overflow = "auto";
	document.getElementsByClassName('table').style.height = "auto";*/
    var printContents = document.getElementById(divId).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = "<html><head><link href=\"base/libs/bootsrtap/css/bootstrap.css\" rel=\"stylesheet\"></head><body>" + printContents + "</body>";
    window.print();
    document.body.innerHTML = originalContents;
	location.reload();
} 

function jsClearForm(form){
	var form = $(form);
	form.find('input,textarea').val('');
	form.find('select').val('').trigger('change');
	form.find('select').val('').trigger("chosen:updated");
}

function getListError(message){
    var errors ='<ul>';
    $.each(message, function(index, value) {
        $.each(value,function(i,subvalue){
            errors += '<li>' + subvalue+'</li>';
        });
    });
    errors += '</ul>';
    return errors;
}

function goToByScroll(id) {
    id = id.replace("link", "");
    $('html,body').animate({
        scrollTop: $("#" + id).offset().top
    }, 'slow');
}

function html2json() {
	var $table = $('table');
	var $ths = $table.find('thead>tr>th');
	var rows = {};
	$table.find('tbody>tr').each(function () {
	  var row = {};
	  $(this).children().each(function (index) {
		row[$ths[index].textContent] = this.textContent;
	  });
	  rows[row.srno] = row;
	});
	return JSON.stringify(rows);
}

//Converte tr to json
function getJsonRow(tr) {
	var $ths = tr.closest('table').find('thead>tr>th');
	var rows = {};

	tr.each(function() {
		var row = {};
		//Pega todos filhos exceto .actions;
		$(this).children().not('.actions').each(function(index) {
			row[$ths[index].textContent.toLowerCase()] = this.textContent;
		});
		
		rows = row;
	});
	return rows;
}

//Save modal jquery
(function () {

	$.fn.saveForm = function(url,options){
		var $form = $(this);
		var defer = $.Deferred();

		//options
		var settings = $.extend({
			modalClose:null,
			dataType:'json',
			notSubmit: false
		}, options );

		var sendForm = function(){
			$form.find('button[type=submit]').attr('disabled', 'disabled');
			var dados = new FormData(document.getElementById($form.attr('id')));

			//Pega todos arquivos
			$form.find('input[type=file]').each(function(index,el) {
				var nameInput = $(el).attr("name");
				var idInput = $(el).attr("id");
				if (idInput == undefined) return;
				dados.append(nameInput.replace("[]",""),$(el).prop('files'));
		
				var ins = document.getElementById(idInput).files.length;
				for (var x = 0; x < ins; x++) {
					dados.append(nameInput, document.getElementById(idInput).files[x]);
				}
			});
	
			//Envia ajax.
			$.ajax({
				type: 'post',
				url: url,
				enctype: 'multipart/form-data',
				dataType: settings.dataType,
				cache: false,
				contentType: false,
				processData: false,
				data: dados,
				success: function(response){
					//Chama evento afterSubmit
					$form.trigger('afterSubmit',[response]);

					if(response.statusCode == 201 || response.statusCode == 200){
						msgInfoBox('success',response.message);
						if(settings.modalClose) hideModalData(settings.modalClose,response);
	
					}else if(response.statusCode == 400 || response.statusCode == 401){
						msgInfoBox('warning',response.message);
	
						if(settings.modalClose) hideModalData(settings.modalClose,response);
					}else{
						jsAlertBox('error','Erro ao salvar',response.message);
					}
					defer.resolve(response);
					
					//Ativa botao submit novamente
					$form.find('button[type=submit]').removeAttr("disabled");
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if(xhr.status == 400){
						var response = JSON.parse(xhr.responseText);

						if(typeof(response.message) === 'object'){
							var errors = getListError(response.message);
							jsAlertBox('error','Erro ao salvar',errors);
						}else{
							jsAlertBox('error','Erro ao salvar',response.message);
						}
					}else{
						console.log(thrownError + "\r\n" + xhr.statusText + "\r\n");
						var response = JSON.parse(xhr.responseText);
						if(response.error){
							jsAlertBox('error','Erro ao salvar',response.message+"<pre style='width: 482px;height: 200px;'>"+response.error+"</pre>");
						}else{
							jsAlertBox('error','Erro ao salvar',response.message);
						}
					}

					defer.reject(xhr);
					//Ativa botao submit novamente
					$form.find('button[type=submit]').removeAttr("disabled");
				}
			});
		}

		//Vincular com submit ou enviar diretamente.
		if(!settings.notSubmit){
			$(this).submit(function(e){
				e.preventDefault();
				sendForm();
			});
		}else{
			sendForm();
		}


		return defer.promise();
	}

}());