$(function(){
	  $('#file').uploadify({
	    'uploader'  : '/flash/uploadify.swf',
	    'script'    : '/save',
	    'cancelImg' : '/images/cancel.png',
	    'auto'      : true,
			'fileDataName' : 'file',
			'fileExt'   : '*.jpg;*.jpeg;*.gif;*.png',
			'removeCompleted' : false,
			onComplete: function(event, ID, fileObj, response, data){
					response = $.parseJSON(response);
					$('#preview').show();
					$('#original').append('<img src="'+response.url+'"/>');
					$('#preview_container').append('<img src="'+response.url+'"/>');
					$('#original img').load(function(){
						addCropper();
					})
					
			}, 
	  });
})

var addCropper = function(){
	
	originalW = $('#original img').width();
	originalH = $('#original img').height();

	$('#original img').Jcrop({
			onChange: 		showPreview,
			onSelect: 		updatePreview,
			setSelect:   	[ ((originalW/2) - 75), ((originalH/2) - 75), ((originalW/2) + 75), ((originalH/2) + 75) ],
			aspectRatio: 	1
		});

		function showPreview(coords){

			var rx = 150 / coords.w;
			var ry = 150 / coords.h;


			$('#cropped img').css({
				width: Math.round(rx * originalW) + 'px',
				height: Math.round(ry * originalH) + 'px',
				marginLeft: '-' + Math.round(rx * coords.x) + 'px',
				marginTop: '-' + Math.round(ry * coords.y) + 'px'
			});

		};

		function updatePreview(coords){
			$("#x1").val(coords.x);
			$("#y1").val(coords.y);
			$("#x2").val(coords.x2);
			$("#y2").val(coords.y2);
			$("#w").val(coords.w);
			$("#h").val(coords.h);
		}
}


