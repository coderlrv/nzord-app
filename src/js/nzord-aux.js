
function printExcelFile(){
    $('.btn-print').addClass('disabled'); 
    var link = document.createElement('a');
    link.href = generateExcelHtml('prtReport');
    link.download = 'report_'+ Math.floor((Math.random() * 9999999) + 1000000) +'.xls';
    link.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window}));
    $('.btn-print').removeClass('disabled'); 
} 

function searchTable(input,tableId){
    var encontrou = false;
    var termo = $('#'+input).val().toLowerCase();    
    $('#'+tableId+' > tbody > tr').each(function(){
        $(this).find('td').each(function(){
            if($(this).text().toLowerCase().indexOf(termo) > -1) encontrou = true;
        });
        if(!encontrou) $(this).hide();
        else $(this).show();
        encontrou = false;
    });
}

function printDiv(divId) {
    var printContents = document.getElementById(divId).innerHTML;
	var originalContents = document.body.innerHTML;
	newWin= window.open("");
	newWin.document.write('<html><head><link rel="stylesheet" media="print" type="text/css" href="./node_modules/bootstrap/dist/css/bootstrap.css"></head><body>'+printContents+'</body></html>');
	newWin.print();
	newWin.close();
} 

function printData(divId,debug){
   var divToPrint=document.getElementById(divId).innerHTML;
   newWin = window.open("");
   var doc = '<html><head></head><body>'+divToPrint+'</body> '+ ( !debug ? '<script> setTimeout(function(){ window.print(); window.close(); }) </script>':'') + '</html>';
   newWin.document.write(doc);
}


function generateexcel(tableid) {
    var table= document.getElementById(tableid);
    var html = table.outerHTML;
    while (html.indexOf('á') != -1) html = html.replace('á', '&aacute;');
    while (html.indexOf('ã') != -1) html = html.replace('ã', '&atilde;');
    while (html.indexOf('â') != -1) html = html.replace('â', '&acirc;');
    while (html.indexOf('Á') != -1) html = html.replace('Á', '&Aacute;');
    while (html.indexOf('À') != -1) html = html.replace('À', '&Agrave;');
    while (html.indexOf('Ã') != -1) html = html.replace('Ã', '&Atilde;');
    while (html.indexOf('Â') != -1) html = html.replace('Â', '&Acirc;');
    while (html.indexOf('é') != -1) html = html.replace('é', '&eacute;');
    while (html.indexOf('ê') != -1) html = html.replace('ê', '&ecirc;');
    while (html.indexOf('É') != -1) html = html.replace('É', '&Eacute;');
    while (html.indexOf('Ê') != -1) html = html.replace('Ê', '&Ecirc;');
    while (html.indexOf('í') != -1) html = html.replace('í', '&iacute;');
    while (html.indexOf('Í') != -1) html = html.replace('Í', '&Iacute;');
    while (html.indexOf('ó') != -1) html = html.replace('ó', '&oacute;');
    while (html.indexOf('õ') != -1) html = html.replace('õ', '&otilde;');
    while (html.indexOf('ô') != -1) html = html.replace('ô', '&ocirc;');
    while (html.indexOf('Ó') != -1) html = html.replace('Ó', '&Oacute;');
    while (html.indexOf('Ô') != -1) html = html.replace('Ô', '&Ocirc;');
    while (html.indexOf('Õ') != -1) html = html.replace('Õ', '&Otilde;');
    while (html.indexOf('ú') != -1) html = html.replace('ú', '&uacute;');
    while (html.indexOf('Ú') != -1) html = html.replace('Ú', '&Uacute;');
    while (html.indexOf('º') != -1) html = html.replace('º', '&ordm;');
    while (html.indexOf('²') != -1) html = html.replace('²', '&sup2;');
    while (html.indexOf('ñ') != -1) html = html.replace('ñ', '&ntilde;'); 
    while (html.indexOf('Ñ') != -1) html = html.replace('Ñ', '&Ntilde;');  
    while (html.indexOf('Ç') != -1) html = html.replace('Ç', '&Ccedil;');  
    while (html.indexOf('ç') != -1) html = html.replace('ç', '&ccedil;'); 
        

    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html) + '.xlsx');
}


function generateExcelHtml(tableid) {
    var table= document.getElementById(tableid);
    var html = table.outerHTML;
    while (html.indexOf('á') != -1) html = html.replace('á', '&aacute;');
    while (html.indexOf('ã') != -1) html = html.replace('ã', '&atilde;');
    while (html.indexOf('â') != -1) html = html.replace('â', '&acirc;');
    while (html.indexOf('Á') != -1) html = html.replace('Á', '&Aacute;');
    while (html.indexOf('À') != -1) html = html.replace('À', '&Agrave;');
    while (html.indexOf('Ã') != -1) html = html.replace('Ã', '&Atilde;');
    while (html.indexOf('Â') != -1) html = html.replace('Â', '&Acirc;');
    while (html.indexOf('é') != -1) html = html.replace('é', '&eacute;');
    while (html.indexOf('ê') != -1) html = html.replace('ê', '&ecirc;');
    while (html.indexOf('É') != -1) html = html.replace('É', '&Eacute;');
    while (html.indexOf('Ê') != -1) html = html.replace('Ê', '&Ecirc;');
    while (html.indexOf('í') != -1) html = html.replace('í', '&iacute;');
    while (html.indexOf('Í') != -1) html = html.replace('Í', '&Iacute;');
    while (html.indexOf('ó') != -1) html = html.replace('ó', '&oacute;');
    while (html.indexOf('õ') != -1) html = html.replace('õ', '&otilde;');
    while (html.indexOf('ô') != -1) html = html.replace('ô', '&ocirc;');
    while (html.indexOf('Ó') != -1) html = html.replace('Ó', '&Oacute;');
    while (html.indexOf('Ô') != -1) html = html.replace('Ô', '&Ocirc;');
    while (html.indexOf('Õ') != -1) html = html.replace('Õ', '&Otilde;');
    while (html.indexOf('ú') != -1) html = html.replace('ú', '&uacute;');
    while (html.indexOf('Ú') != -1) html = html.replace('Ú', '&Uacute;');
    while (html.indexOf('º') != -1) html = html.replace('º', '&ordm;');
    while (html.indexOf('²') != -1) html = html.replace('²', '&sup2;');
    while (html.indexOf('ñ') != -1) html = html.replace('ñ', '&ntilde;'); 
    while (html.indexOf('Ñ') != -1) html = html.replace('Ñ', '&Ntilde;');  
    while (html.indexOf('Ç') != -1) html = html.replace('Ç', '&Ccedil;');  
    while (html.indexOf('ç') != -1) html = html.replace('ç', '&ccedil;'); 
        

    return 'data:application/vnd.ms-excel,' + encodeURIComponent(html);
}

