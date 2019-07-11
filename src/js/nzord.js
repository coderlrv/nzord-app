(function () {

    var _oldShow = $.fn.show;
    /*
    * Sobreescreve $().show() jquery para emitir eventos beforeShow/afterShow
    * 
    */
    $.fn.show = function(speed, oldCallback) {
        return $(this).each(function() {
                var obj = $(this),
                newCallback = function() {
                if ($.isFunction(oldCallback)) {
                    oldCallback.apply(obj);
                }
                obj.trigger('afterShow');
            };

            // you can trigger a before show if you want
            obj.trigger('beforeShow');

            // now use the old function to show the element passing the new callback
            _oldShow.apply(obj, [speed, newCallback]);
        });
    }

    /*  
    * 
    *   Show content coloca elemento como visivel e forca emitir evento beforeShow/afterShow nos filhos.
    *   Aplica required caso encontre a atributo data-required=true
    * 
    */
    $.fn.showContent = function(){
        var obj = $(this);
        obj.trigger('beforeShow');
        obj.show();
        obj.find('select,input,textarea').each(function(){
            var input = $(this);
            if(input.data('required')){
                input.attr('required','');
            }
        })
        obj.find('select').trigger('afterShow');
    }

    
    /*  
    *   Show content coloca elemento como visivel e forca emitir evento beforeShow/afterShow nos filhos.
    *   
    */
    $.fn.hideContent = function(){
        var obj = $(this);
        obj.trigger('beforeShow');
        obj.hide();
        
        obj.find('select,input,textarea').each(function(){
            var input = $(this);
            if(input.attr('required')){
                input.data('required',true);
                input.attr('required',false);
                input.val(null);
            }
        })
    }

}());

(function () {

    /**
     *  Evento para receber função , ela executada ao finalizar carregamento do html ou 
     * na alteracao do valor do input. 
     *
    */
    $.fn.initOrChange = function(callback){
        var _el = $(this);
        //ao finalizar carramento do html.
        $( document ).ready(function() {
            var val = _el.val();
            callback(val, _el,null);
        });

        //Quando altera valor do componentes.
        $(_el).change(function(ev){
            var val = _el.val();
            callback(val,_el,ev);
        });
    }
}());


/**
 *  Função utilitarias para select 
 * 
 * 
 */
(function () {

    function _load(el,url,params,settings){
        
        let data = {};
        if(params){
            data['q'] = jQuery.param( params ) 
        }

        $.getJSON(baseAppUrl+url,data, function(j){
            var options = '';
            var val = $(el).data('value');
            if(settings.startValue) val = settings.startValue;

            var selectedValue = false;
            for (var i = 0; i < j.length; i++) {
                options += '<option value="' + j[i].id + '"';
                
                if(val == j[i].id){
                    options += ' selected';
                    selectedValue = true;
                }

                options += '>' + j[i].nome + '</option>';
            }
            //Seta value como null caso nao selecione nenhuma opção.
            if(!selectedValue) $(el).data('value',null);

            $(el).html(options).show();
            $(el).data('sync',true);
            $(el).trigger( "finishLoad");
        });
    }
    
    /**
     *  Carrega select com url 
     * @param {*} elementChange - Elemento que fica escutando a alteração do valor , para carregar o elemento atual 
     * @param {*} url - Url do ajax
     * @param {*} params - parametro enviado por requisição Ex: ?id=43
     * @param {*} options - objeto passando opções
     */
    $.fn.loadSelect = function(elementChange,url,params,options) {
        var  _self = this;
        var _el = $(_self);

        if(!params) params = {};
        //Opções  
        var settings = $.extend({
            permiteNull:false,
            eventChangeOrInit: 'all', // change, init, or all
            startValue:null,
            paramNameID:'id',
            forceLoadInit:false,
            forceReload:false
        }, options );

        if(elementChange){
            // Somente no change
            if(settings.eventChangeOrInit == 'change'){
                $(elementChange).change(function(){
                    _val = $(elementChange).val();
                    //Seta nome paramentro pego do elemento
                    params[settings.paramNameID] = _val;

                    //Carrega ajax
                    _load(_el,url,params,settings);
                })
            //Somenete ao iniciar
            }else if(settings.eventChangeOrInit == 'init'){
                $( document ).ready(function() {
                    _val = $(elementChange).val();
                    //Seta nome paramentro pego do elemento
                    params[settings.paramNameID] = _val;

                    //Carrega ajax
                    _load(_el,url,params,settings);
                });
            }else{
                $(elementChange).initOrChange(function(){
                    //Verifica se elemento esta visivel para carregar.
                    if($(_el).is(':visible')){
                        _val = $(elementChange).val();
                        //Seta nome paramentro pego do elemento
                        params[settings.paramNameID] = _val;

                        //Carrega ajax
                        _load(_el,url,params,settings);
                    }
                })
            }

        }else{
            //Carrega somente select selecionado caso for visivel ou utilizar opcao forceLoadInit = true
            if($(_el).is(':visible') || settings.forceLoadInit){
                _load(_el,url,params,settings);
            }

            //  Evento para carregar após elemento for visivel.
            // afterShow - Evento é emitido pela função $('').showContent();
            $(_el).bind('afterShow', function(){
                if(!$(_el).data('sync') || settings.forceReload)  
                    _load(_el,url,params,settings);
            })
        }
    };
    
}());


/**
 *  Função utilitarias para select 
 * 
 * 
 */
(function () {
    //
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
          clearTimeout (timer);
          timer = setTimeout(callback, ms);
        };
    })();
    
    //Template modulo.
    function _createdBox(name,data){
        try{
            var box = '<div id="' + name + '-box-autocomplete" class="auto-complete" style="position:absolute;z-index: 999;">' +
                        '<ul class="dropdown-menu" role="menu" aria-labelledby="'+name+'" style="display: block;"> ';            
            data.forEach((el,index) => {
                box += '<li ';
                if(index == 0) box += 'class="active"'; 
                box += ' data-key="'+ el.id +'">'+el.val+'</li>';
            });    
            /*data.each(function(el,index){                
                box += '<li ';
                if(index == 0) box += 'class="active"'; 
                box += ' data-key="'+ el.id +'">'+el.val+'</li>';
            });*/
            box = box += '</ul></div>';
            return box;
        }catch(err){
            console.error('Erro no formato do retorno.');
        }
    }

    //Aplica navegação tecla seta pra cima e para baixo
    function _navegation(e,id){
        var box = $('#'+id+'-box-autocomplete');
        if(!box) return;

        var $current = box.find('ul li.active');
        var $next;
        if (e.keyCode == 38)
            $next = $current.prev();
        if (e.keyCode == 40)
            $next = $current.next();

        if ($next.length > 0) {
            $('#'+id+'-box-autocomplete ul li').removeClass('active');
            $next.addClass('active');
        }
    }

    // Seta ativado elemento passado por paramentro
    function _setActive(id,el){
        $('#'+id+'-box-autocomplete')
            .find('ul li')
            .removeClass('active');
        el.addClass('active');
    }

    //Get li com classe ativado.
    function _getActive(id){
        var active = $('#'+id+'-box-autocomplete').find('ul li.active');
        return {
            'id': active.data('key'),
            'val': active.text()
        }
    }
    //Remove box de autocomplete.
    function _removeBox(id){
        $('#'+id+'-box-autocomplete').remove();
    }

    $.fn.autoComplete = function(url,data,callback,options){
        var el    = $(this);
        var id    = el.attr('id');
        var boxEl = $('#'+id+'-box-autocomplete');
        
        //options
        var settings = $.extend({
            lengthMin:3,
            typeReq:'GET',
            maxWidth:null
        }, options );

        //Busca registro especificado pelo id.
        var getValSelected = function(){
              //Busca registro pelo ID passado.
              var value = el.val();
              if(value.length > 0 && $.isNumeric(value)){
                  if(!data){
                      data = { search: value,check:true };
                  }else{
                      data['search'] = value;
                      data['check'] = 1;
                  }
                  $.ajax({
                      url: url,
                      type: settings.typeReq,
                      data: data,
                      beforeSend: function(){
                          el.addClass('loading');
                      },
                      complete: function(){
                          el.removeClass('loading');
                      },
                      success:function(data){
                          if(data){
                              callback({
                                  'id': data.id,
                                  'val': data.val
                              });
                              
                              _removeBox(id);
                          }else{
                              callback(null);
                          }
                          //Emite evento de sucesso.
                          el.trigger('success',[data]);
                      }
                  });

              }else{
                  callback(null);
                  //Emite evento de sucesso.
                  el.trigger('success',[null]);
              }
        }

        // Adiciona evento de navegacao
        $(window).keyup(function (e) {
            var keyCode = e.keyCode || e.which;
            if(keyCode == 38 || keyCode == 40){ //Seta para cima/baixo na navegação
                _navegation(e,id);
            }
        });

        el.keydown(function(e){
            var keyCode = e.keyCode || e.which;

            //'Tab'
            if(keyCode == 9){
                getValSelected()
            }else if (keyCode == 13){ // Usar 'enter' para selecionar registro
                var data = _getActive(id)
                
                callback(data);
                //Emite evento de sucesso.
                // el.trigger('success',[data]);
                getValSelected()
                _removeBox(id);
            }
        });

        el.keyup(function(e){
            var keyCode = e.keyCode || e.which;
            if (keyCode == 40) {
                boxEl.focus();
            }else if(keyCode == 27){
                _removeBox(id);
            }else{

                //Busca listagem de sujestoes 
                delay(function(){
                    if(el.val().length > settings.lengthMin){
                        if(!data){
                            data = { search: el.val() ,check:0 };
                        }else{
                            data['search'] = el.val();
                            data['check'] = 0;
                        }

                        $.ajax({
                            url: url,
                            type: settings.typeReq,
                            data: data,
                            beforeSend: function(){
                                el.addClass('loading');
                            },
                            complete: function(){
                                el.removeClass('loading');
                            },
                            success:function(data){
                                if(data.length > 0){
                                    //Remove box antes de montalo.
                                    _removeBox(id);

                                    el.closest('div').after(_createdBox(el.attr('id'),data));

                                    $('#'+id+'-box-autocomplete ul li')
                                        .click(function(e){
                                            _setActive(id,$(this));
                                      
                                            callback(_getActive(id))
                                            //Emite evento de sucesso.
                                            getValSelected()
                                            //el.trigger('success',[_getActive(id)]);

                                            //Remove box.
                                            _removeBox(id);
                                            el.blur();
                                        });
                                }
                            }
                        });
                        
                    }else{
                        _removeBox(id);
                    }
                }, 300);
            }
        });

        //Executa para recuperar dados ja existente.
        setTimeout(function(){ 
            getValSelected();
        }, 100);
    }
}());


/**
 *  Multi Check list
 * 
 */

(function () {
    var CheckList = function(element, options){
        var self = this;
        
        //Opções
        self.settings = $.extend({
            selectedAll:false
        }, options );

        //criar propriedades com os elementos.
        self.element = $(element);
        self.container = $('<div/>', { 'class': "checklist-container" });
        self.ul = $('<ul />',{'class':'checklist'});

        self.liSelectAll = self._createdSelectedAll();
        self.liSelectAll.change(self._selectedAll.bind(self));

        //adiciona botão para seleção geral.
        if(self.settings.selectedAll){
            self.ul.append(self.liSelectAll);
        }

        //Gera lista <li>
        self.options = self.element.find('option');
    
        for ( var i = 0; i < self.options.length; i++) {
            var $opt = $(self.options[i]);
            var checked = !!$opt.attr('selected');
            var li = self._createdLi($opt.text(),$opt.val(),checked) 
            
            //Click na LI.
            li.click(function(e){
                e.stopPropagation();
                if($(e.target).find('input').prop('checked')){
                    $(e.target).find('input').prop('checked',false).trigger('change');
                }else{
                    $(e.target).find('input').prop('checked','checked').trigger('change');
                }
            });

            //Aplica evento change no input <li>
            // .bind transforma this de setOption para da classe CheckList
            li.find('input').change(self._setOption.bind(self));

            self.ul.append(li);
        }

       // self.element.css('display','none');
        self.container.append(self.ul);
        self.element.after(self.container);
        //marca caso venha valor selecinado.
        //self.ul.find('input[data-option='+this.element.val()+']').prop('checked','checked').trigger('change');
    }
    
    CheckList.prototype = {
        _setOption : function(e,val){
            e.stopPropagation();
            var opt = $(e.target);

            if(opt.prop('checked')){
                this.element.find('option[value='+opt.data('option')+']').attr('selected','selected');
            }else{
                this.element.find('option[value='+opt.data('option')+']').removeAttr('selected');
            }
        },
        //Criar li com input
        _createdLi : function(text,val,selected){
            var html = '<li '+(val?'':'style="display:none"')+'>'+
                '<span class="filtrable">'+
                    '<input type="checkbox" '+(selected ? 'checked':'')+' onclick="event.stopPropagation();" class="form-check-input" data-option='+val+'>'+
                    '<label>'+text+'</label> '+
                '</span></li>';

            return $(html);
        },

        _createdSelectedAll : function(){
            return $('<li style="background-color:#f3f3f4"><span class="filtrable">'+
                '<input type="checkbox" class="check-all">'+
                '<label class="select-all">Seleciona todos</label>'+
                '</span></li>');
        },

        _selectedAll : function(e){
            console.log(e);
            if($(e.target).find('input').prop('checked')){
                this.ul.find('input').not('.check-all').prop('checked','checked').trigger('change');
                this.ul.find('input').not('.check-all').trigger('change');
            }else{
                this.ul.find('input').not('.check-all').prop('checked',false);
                this.ul.find('input').not('.check-all').trigger('change');
            }
        }
    }

    $.fn.checkList = function(options){
        var el = $(this);
        el.data('checklist', new CheckList(el, options));
        return this;
    }
}());

