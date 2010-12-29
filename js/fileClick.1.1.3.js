/* jQuery fileClick v1.1.3
 * ----------------------------------------------------------
 * Author: Denis Ciccale (dciccale@gmail.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
$(function () {

    // namespace
    var fileClick = {},
		// variables
		link = $(".jAttachDocument"),
        hoverClass = "jUploadButtonHover",
        inputContainer = $(".jFileInputContainer"),
        input = $(".jInputFile"),
        NoAttachMents = $(".jNoAttachments"),
        FilesList = $(".jUploadList"),
        FileCount = 0,
        FileNames = [],
        ItemSelector = "jFile",
    // template de cada fichero nuevo
        ItemTemplate = '<li class="{ItemSelector}">{FileName}<a href="#" class="jRemoveFile">X</a></li>',
        inputDefaultClass = input.attr("class"),
        inputDefaultID = "jInputFile",
        inputDefaultName = input.attr("name");



    /* ******************************************************
    Funcion que se ejecuta despues de seleccionar un fichero
    ******************************************************* */
    fileClick.onSelect = function (e) {
        // nombre del fichero (valor del target del input)
        var fileName = $(e.target).val() || window.event.srcElement.value;

        // en opera y en ie agrega todo el path, nos quedamos solo con el nombre del fichero
        fileName = fileName.match(/[^\/\\]+$/)[0];

        // verifico que no haya un fichero con el mismo nombre
        if (fileClick.existFile(fileName)) {
            alert("Ya existe un fichero con ese nombre");
        }
        else {
            // agrego el fichero a la lista
            fileClick.addFile(fileName);
        }
		
		// quito la clase de hover del link
		link.removeClass(hoverClass);
		
        // actualizo el input
        fileClick.refreshInput();
    }


    /* ***************************
    Agrega un fichero a la lista
    **************************** */
    fileClick.addFile = function (fileName) {
        var item, inputClone;

        // sumo 1 al contador de ficheros
        FileCount = FileCount + 1;

        // agrego el nombre a la lista
        FileNames.push(fileName);

        // template local
        item = ItemTemplate;

        // reemplazo las variables en el template
        item = item.replace("{ItemSelector}", ItemSelector);
        item = item.replace("{FileName}", fileName);

        // cojo el input modifico el id para que sea unico y lo oculto
        inputClone = fileClick.fileInput.getInstance().unbind().attr("id", "inputFile" + FileCount).css({ top: -3000 });

        // agrego el input file al item
        item = $(item).append(inputClone);

        // agrego el item
        FilesList.append(item);

        // si hay ficheros oculto el item de "no hay documentos adjuntos"
        if (FileCount > 0) {
            NoAttachMents.hide();
        }
    };


    /* ***************************
    Quita un fichero de la lista
    **************************** */
    fileClick.removeFile = function (file) {
        // resto 1 al contador de ficheros
        FileCount = FileCount - 1;

        // quito el fichero del array de nombres index-1 porque esta contando el item de "no hay documentos adjuntos"
        FileNames.splice(file.index()-1, 1)

        // quito el item de la lista
        file.remove();

        // si no hay ficheros muestro el item de "no hay documentos adjuntos"
        if (FileCount == 0) {
            NoAttachMents.show();
        }
    };


    /* ****************************************
    Accion que remueve un fichero de la lista
    ***************************************** */
    $(".jRemoveFile").live('click', function (e) {
		e.preventDefault();
		
        // busco el item
        var item = $(this).parents("." + ItemSelector);

        // quito el item
        fileClick.removeFile(item);
    });


    /* *************************************************
    Verifico que no haya un fichero con el mismo nombre
    ************************************************** */
    fileClick.existFile = function (fileName) {
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
    fileClick.bindEvents = function () {
        var input = fileClick.fileInput.getInstance();

        // clase de hover para el link
        input.bind('mouseover mouseout',
            function () {
                link.toggleClass(hoverClass);
            }
        );

        // Evento que se dispara luego de seleccionar un fichero
        // IE7
        if ($.browser.msie && $.browser.version.substr(0, 1) == 7) {
            input[0].attachEvent("onpropertychange", fileClick.onSelect);
        }
        // OTROS
        else {
            input.change(fileClick.onSelect);
        }
    };

    /* **********************************
    Funcion que actualiza el input file
    *********************************** */
    fileClick.refreshInput = function () {
        // creo el nuevo input
        var newInput = $("<input type='file' class='" + inputDefaultClass + "' id='" + inputDefaultID + "' name='" + inputDefaultName + "' />");

        // guardo la instancia del input
        fileClick.fileInput.setInstance(newInput);

        // hago un bind de los eventos
        fileClick.bindEvents(newInput);

        // inserto el nuevo input
        inputContainer.html(newInput);
    };

	
	/* **************************************************
    Objeto que guarda la instancia del input file actual
    *************************************************** */
    fileClick.fileInput = {
        setInstance: function (elem) { this.newInput = elem; },
        getInstance: function () { return this.newInput || input; }
    };
	
	
	/* **************
    Inicio el script
    *************** */
	fileClick.init = (function () {
		// hago un bind inicial
		fileClick.bindEvents();
		
		// seteo el tamaño del contenedor del input file para encajar con el elemento disparador
		inputContainer.css({ width: link[0].offsetWidth, height: link[0].offsetHeight });
	})();
	
});