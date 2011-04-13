/* jQuery fileClick Plugin v1.4
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
			
			// default options
			var defaults = {
				hoverClass: "jUploadButtonHover",
				ItemTemplate: '<li class="{ItemSelector}"><a href="#" class="jRemoveFile">X</a>{FileName}</li>',
				InputID: "InputID",
				InputName: "Files",
				ItemSelector: "jFile",
				inputDefaultClass: "jInputFile"
			},
			
			options = $.extend({}, defaults, options);
			
			return this.each(function(i) {
				var o = options,
					container = $(this),
					link = container.find(".jAttachDocument"),
					inputContainer = container.find(".jFileInputContainer"),
					NoAttachments = container.find(".jNoAttachments"),
					FilesList = container.find(".jUploadList");
					
					
					/* **************************
					Guarda la lista de ficheros
					*************************** */
					var Files = function() {
						var FileNames = [];
						
						return {
							add: function(fileName) { FileNames.push(fileName); },
							remove: function (fileIndex) { FileNames.splice(fileIndex-1, 1); },
							count: function () { return FileNames.length; },
							names: function () { return FileNames; }
						}					
					}();
					
					
				   /* *****************************************
					Funcion después de seleccionar un fichero
					***************************************** */
					function onSelect() {
						// en opera y en ie agrega todo el path, nos quedamos solo con el nombre del fichero
						var fileName = fileInput.getValue().match(/[^\/\\]+$/)[0];

						// si existe un fichero con el mismo nombre muestro un error
						if (existFile(fileName)) {
							alert("Ya existe un fichero con ese nombre");
						}
						// si no lo agrego a la lista
						else {
							addFile(fileName);
						}
						
						// quito la clase de hover del link, porque a veces se queda
						link.removeClass(o.hoverClass);
						
						// creo un nuevo input
						createInput();
					}


					/* ***************************
					Agrega un fichero a la lista
					**************************** */
					function addFile(fileName) {
						var item, inputClone;
						
						// guardo el fichero
						Files.add(fileName);

						// template local
						item = o.ItemTemplate;

						// reemplazo las variables en el template
						item = item.replace("{ItemSelector}", o.ItemSelector).replace("{FileName}", fileName);

						// cojo el input modifico el id para que sea unico y lo oculto
						inputClone = fileInput.getInstance()
						.unbind()
						.attr({
							"id": o.InputID + i + "_" + Files.count(),
							"name": o.InputName + i + "[]"
						})
						.css({ top: -3000 });

						// agrego el input file al item
						item = $(item).append(inputClone);

						// agrego el item
						FilesList.append(item);

						// si hay ficheros, oculto el item de "no hay documentos adjuntos"
						if (Files.count() > 0 && NoAttachments.is(":visible")) {
							NoAttachments.hide();
						}
					}


					/* ***************************
					Quita un fichero de la lista
					**************************** */
					function removeFile(item) {
						// quito el fichero de la lista guardada
						Files.remove(item.index());

						// quito el item de la lista
						item.remove();

						// si no hay ficheros muestro el item de "no hay documentos adjuntos"
						if (Files.count() == 0) {
							NoAttachments.show();
						}
					}


					/* ****************************************
					Accion que remueve un fichero de la lista
					***************************************** */
					container.delegate('.jRemoveFile', 'click', function (e) {
						e.preventDefault();
						
						// busco el item
						var item = $(this).parents("." + o.ItemSelector);

						// quito el item
						removeFile(item);
					});


					/* *************************************************
					Verifica que no haya un fichero con el mismo nombre
					************************************************** */
					function existFile(fileName) {
						var FileNames = Files.names(), i = FileNames.length, exists = false;
						
						while (i-- && !exists) {
							exists = FileNames[i] == fileName;
						}
						
						return exists;
					}

					
					/* **********************
					Instancia de cada input
					*********************** */
					var fileInput = {
						setInstance: function (elem) { this.newInput = elem; },
						getInstance: function () { return this.newInput; },
						getValue: function () { return this.newInput.val(); }
					};
					
					
					/* *****************
					Crea el input file
					****************** */
					var createInput = (function () {
					
						function init() {
							// creo el nuevo input
							var newInput = $("<input type='file' class='" + o.inputDefaultClass + "' id='" + o.InputID + i + "' name='" + o.InputName + i + "[]' />");

							// guardo la instancia del input
							fileInput.setInstance(newInput);

							// hago un bind de los eventos
							newInput
							// clase de hover para el link
							.bind('mouseover mouseout',
								function () {
									link.toggleClass(o.hoverClass);
								}
							)
							// evento que se dispara luego de seleccionar un fichero
							.change(onSelect);

							// inserto el nuevo input
							inputContainer.html(newInput);
						}
						
						init();
						
						return init;
					})()
					
					
					// seteo el tamaño del contenedor del input file para encajar con el elemento disparador
					inputContainer.css({ width: link[0].offsetWidth, height: link[0].offsetHeight });
			});
		}
	});
})(jQuery);