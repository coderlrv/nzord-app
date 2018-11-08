(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    // minimal dialog plugin
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'nzord-images': function (context) {
            var self = this;

            // ui has renders to build ui elements.
            //  - you can create a button with `ui.button`
            var ui = $.summernote.ui;

            var $editor = context.layoutInfo.editor;
            var $editable = context.layoutInfo.editable;
            var options = context.options;

            var image = {};

            // Adiciona botão ao summernote
            context.memo('button.nzord-images', function () {
                return ui.button({
                    contents: '<i class="note-icon-picture"/>',
                    tooltip: 'Inserir Imagem',
                    click: function(e){
                        //Chama modal Nzord para selecao do arquivo.
                        sysModalBoxJs('Arquivos Publicos','app/system/public-file/list-files',false,'mdlArquivosPublico');

                        $('div[name=mdlArquivosPublico]')
                            .on('hidden.bs.modal', function (e,data) {
                                if(!data) return;
                                
                                context.invoke('nzord-images.showDialog',{
                                    url:data
                                });
                            });
                    }
                }).render();
            });

            // This method will be called when editor is initialized by $('..').summernote();
            // You can create elements for plugin
            self.initialize = function () {

                var $container = options.dialogsInBody ? $(document.body) : $editor;

                var body = '<div class="form-group row-fluid">' +
                    '<label for="imageUrl">URL</label>' +
                    '<input type="text" class="form-control input-sm" id="imageUrl" placeholder="http://....">' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-xs-2">' +
                    '<label for="imageWidth">Largura</label>' +
                    '<input type="imageWidth" class="form-control input-sm" id="imageWidth" value="780" placeholder="px">' +
                    '</div>' +
                    '<div class="col-xs-2">' +
                    '<label for="imageHeight">Altura</label>' +
                    '<input type="imageHeight" class="form-control input-sm" id="imageHeight" placeholder="px">' +
                    '</div>' +
                    '</div>';

                var footer = '<button href="#" class="btn btn-primary ext-nzord-images-btn">Ok</button>';

                self.$dialog = ui.dialog({
                    title: 'Inserir Imagem',
                    fade: options.dialogsFade,
                    body: body,
                    footer: footer
                }).render().appendTo($container);
            };

            self.destroy = function () {
                self.$dialog.remove();
                self.$dialog = null;
            };

            self.showDialog = function (params) {
                var $img = $($editable.data('target'));
                var $elUrl = self.$dialog.find('#imageUrl');
                $elUrl.val(params.url)

                self
                    .openDialog()
                    .then(function (dialogData) {
                        
                        ui.hideDialog(self.$dialog);

                        var width = dialogData.width > 0 ? ' width="'+dialogData.width+'px"' : '';
                        var height = dialogData.height > 0 ? ' height="'+dialogData.height+'px" ' : '';

                        var $img = $('<img src="' + dialogData.url + '" ' + width + height + '></img>');
                        context.invoke('editor.insertNode', $img[0]);
                    })
                    .fail(function () {
                        context.invoke('editor.restoreRange');
                    });

            };

            self.openDialog = function (url) {
                return $.Deferred(function (deferred) {
                    var $dialogBtn = self.$dialog.find('.ext-nzord-images-btn');
                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');

                        $dialogBtn
                            .click(function (event) {
                                event.preventDefault();

                                var $elUrl = self.$dialog.find('#imageUrl');
                                var $elWitdh = self.$dialog.find('#imageWidth');
                                var $elHeight = self.$dialog.find('#imageHeight');
            
                                deferred.resolve({
                                    url: $elUrl.val(),
                                    width: $elWitdh.val(),
                                    height:$elHeight.val()
                                });
                            });
                    });

                    ui.onDialogHidden(self.$dialog, function () {
                        $dialogBtn.off('click');

                        if (deferred.state() === 'pending') {
                            deferred.reject();
                        }
                    });

                    ui.showDialog(self.$dialog);
                });
            };

        }
    });
}));