(function($) {
'use strict';
$( document ).ready(function() {
	
	var token = 'BdEvbHrNheoAAAAAAAAHHzmsTXolNO7yDRq8X1LBVS6f_L7ixn61D205tM0lfzFF',
	
	client = new Dropbox.Client({ token: token }), loc = getUrlParameter('loc'), 
	refreshRate = getUrlParameter('refreshRate'), container = $('#container');	

	function getUrlParameter(sParam) {
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return window.decodeURIComponent(sParameterName[1]);
	        }
	    }
	}

	if (!loc){
		container.html('Dropbox location is not defined in url. hint: loc=myDropboxFolder');
		throw new Error('Dropbox location is not defined in url. hint: loc=myDropboxFolder');
	}

	container.height(window.innerHeight);	
	
	function hideShowEl(){
		var el = $('.show')
		el.removeClass('show');
		if (el.next().length > 0){
			el = el.next();
		} else {			
			el = $('#container > li:first-child');			
		}
		setTimeout(function(){el.addClass('show');}, 200);
		setTimeInterval(el.data('time'));
	}

	function setTimeInterval(time) {
		setTimeout(hideShowEl, time*1000);		
	}

	function startAnnimation() {
		var el = $('#container > li:first-child'), time = el.data('time');
		el.addClass('show');
		setTimeInterval(time);
		
	}
	

	client.readdir('/'+loc, null, function(error, files){				
		$.each(files, function(index, file){
			addFileToArray(index, file)
		});			
		startAnnimation();
	});			


	function addFileToArray(index, file) {
		var fileName = '/'+loc+'/'+file, matchingArray = file.match(/\(\d+\)/), 
		matching = matchingArray && matchingArray.length > 0 ? matchingArray[0] : '(10)',
		time = matching.replace('(', '').replace(')', '');

		client.readFile('/'+loc+'/'+file, {blob: true}, function(error, obj){		
			// Obtain a blob: URL for the image data.	    										
		    var urlCreator = window.URL || window.webkitURL;	    
		    var imageUrl = urlCreator.createObjectURL( obj );	    		    
		    var li = $('<li/>');		    		    
		    li.data('time', time);
		    var image = new Image();		    
		    image.src  = imageUrl;		   
		    li.append(image);
		    container.append(li);
		});		

	}
	    
});

})(jQuery);