/* jQuery fileClick Plugin v1.2
 * ----------------------------------------------------------
 * Author: Denis Ciccale (dciccale@gmail.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {
	$.fn.extend({
		fileClick: function(options) {
			
			// namespace
			var fileClick = {};
			
			// defaults
			fileClick.defaults = {
				hoverClass: "jUploadButtonHover",
				// template de cada fichero nuevo
				ItemTemplate: '<li class="{ItemSelector}">{FileName}<a href="#" class="jRemoveFile">X</a></li>',
				InputID: "InputID",
				InputName: "Files"
			};
			
			fileClick.options = $.extend(fileClick.defaults, options);
			
			return this.each(function() {
				var o = fileClick.options, 
					container = $(this),
					link = container.find(".jAttachDocument"),
					removeFileLink = container.find(".jRemoveFile"),
					inputContainer = container.find(".jFileInputContainer"),
					input = container.find(".jInputFile"),
					NoAttachments = container.find(".jNoAttachments"),
					FilesList = container.find(".jUploadList"),
					FileCount = 0,
					FileNames = [],
					ItemSelector = "jFile",
					inputDefaultClass = "jInputFile";
					
					// mantengo un contador global de cada instancia de fileClick
					window.fileClick = (window.fileClick || 0) + 1;
					// lo guardo en esta variable para que el id de los inputs sea diferente
					var fileClickCount = window.fileClick;
					
				   /* ******************************************************
					Funcion que se ejecuta despues de seleccionar un fichero
					******************************************************* */
					function onSelect(e) {
						// nombre del fichero (valor del target del input)
						var fileName = fileInput.getInstance().val();

						// en opera y en ie agrega todo el path, nos quedamos solo con el nombre del fichero
						fileName = fileName.match(/[^\/\\]+$/)[0];

						// verifico que no haya un fichero con el mismo nombre
						if (existFile(fileName)) {
							alert("Ya existe un fichero con ese nombre");
						}
						else {
							// agrego el fichero a la lista
							addFile(fileName);
						}
						
						// quito la clase de hover del link
						link.removeClass(o.hoverClass);
						
						// actualizo el input
						refreshInput();
					}


					/* ***************************
					Agrega un fichero a la lista
					**************************** */
					function addFile(fileName) {
						var item, inputClone;
						
						// sumo 1 al contador de ficheros
						FileCount = FileCount + 1;
						
						// agrego el nombre a la lista
						FileNames.push(fileName);

						// template local
						item = o.ItemTemplate;

						// reemplazo las variables en el template
						item = item.replace("{ItemSelector}", ItemSelector);
						item = item.replace("{FileName}", fileName);

						// cojo el input modifico el id para que sea unico y lo oculto
						inputClone = fileInput.getInstance()
						.unbind()
						.attr({
								"id": o.InputID + fileClickCount + "_" + FileCount,
								"name": o.InputName + fileClickCount + "[]"
						})
						.css({ top: -3000 });

						// agrego el input file al item
						item = $(item).append(inputClone);

						// agrego el item
						FilesList.append(item);

						// si hay ficheros oculto el item de "no hay documentos adjuntos"
						if (FileCount > 0) {
							NoAttachments.hide();
						}
					};


					/* ***************************
					Quita un fichero de la lista
					**************************** */
					function removeFile(file) {
						// resto 1 al contador de ficheros
						FileCount = FileCount - 1;
						
						// quito el fichero del array de nombres index-1 porque esta contando el item de "no hay documentos adjuntos"
						FileNames.splice(file.index()-1, 1)

						// quito el item de la lista
						file.remove();

						// si no hay ficheros muestro el item de "no hay documentos adjuntos"
						if (FileCount == 0) {
							NoAttachments.show();
						}
					};


					/* ****************************************
					Accion que remueve un fichero de la lista
					***************************************** */
					removeFileLink.live('click', function (e) {
						e.preventDefault();
						
						// busco el item
						var item = $(this).parents("." + ItemSelector);

						// quito el item
						removeFile(item);
					});


					/* *************************************************
					Verifico que no haya un fichero con el mismo nombre
					************************************************** */
					function existFile(fileName) {
						var i;
						for (i = 0; i < FileNames.length; i++) {
							if (FileNames[i] == fileName) {
								return true;
							}
						}
						return false;
					};


					/* ********************
					Eventos del input file
					********************* */
					function bindEvents() {
						var input = fileInput.getInstance();

						// clase de hover para el link
						input.bind('mouseover mouseout',
							function () {
								link.toggleClass(o.hoverClass);
							}
						);

						// Evento que se dispara luego de seleccionar un fichero
						// IE7
						if ($.browser.msie && $.browser.version.substr(0, 1) == 7) {
							input[0].attachEvent("onpropertychange", onSelect);
						}
						// OTROS
						else {
							input.change(onSelect);
						}
					};

					/* **********************************
					Funcion que actualiza el input file
					*********************************** */
					function refreshInput() {
						// creo el nuevo input
						var newInput = $("<input type='file' class='" + inputDefaultClass + "' id='" + o.InputID + fileClickCount + "' name='" + o.InputName + fileClickCount + "[]' />");

						// guardo la instancia del input
						fileInput.setInstance(newInput);

						// hago un bind de los eventos
						bindEvents(newInput);

						// inserto el nuevo input
						inputContainer.html(newInput);
					};

					
					/* **************************************************
					Objeto que guarda la instancia del input file actual
					*************************************************** */
					var fileInput = {
						setInstance: function (elem) { this.newInput = elem; },
						getInstance: function () { return this.newInput || input; }
					};
					
					
					/* **************
					Inicio el script
					*************** */
					// creo los inputs
					refreshInput();
						
					// seteo el tamaño del contenedor del input file para encajar con el elemento disparador
					inputContainer.css({ width: link[0].offsetWidth, height: link[0].offsetHeight });
			});
		}
	});
})(jQuery);