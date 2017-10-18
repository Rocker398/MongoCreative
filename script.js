angular.module('ImageCorkboard', [])
  .controller('MainCtrl', mainCtrl)
  .directive('imageCork', imageDirective);

function mainCtrl ($scope) {
	var down = false;
	$(document).mousedown(function() {
		down = true;
	}).mouseup(function() {
		down = false;  
	});

	$scope.images = [];
	$scope.width = 30;
	
	$scope.addImage = function (image) {
		$scope.images.push({ 
			Url: image.Url
		});
		
		image.Url = '';
		
		setTimeout(triggerSlider, 0.1);
	};

	// $scope.widthChange = function() {
	// 	var a = $('input[type=range]').val();
	// 	console.log(a);
	// 	$scope.width = a+'%';
	// };

	$scope.delete = function(image){
		//if(down){
			console.log(image);
			$('.ImageCork').addClass('delete');
			
		//}
	}
}

function triggerSlider() {
	$('input[type=range]').trigger('input');
};

function imageDirective () {
	return {
		scope: {
			image: '=', /* [1] */
			index: '@'
		},
		restrict: 'E', /* [2] */
		replace: 'true',
		template: (
			'<div class="ImageCork" style="z-index:{{index}};">' +
				'<div class="imageFrame">' +
					'<img ng-click="delete(image)" class="trash" title="Remove" src="https://d30y9cdsu7xlg0.cloudfront.net/png/3823-200.png">'+
					'<img ng-src="{{image.Url}}" />' +
				'</div>' +
			'</div>'
		), /* [3] */
		link: link
	};

	function link (scope, elm) { /* [4] */
		if (!scope.image.Url) {
			scope.image.Url = 'placeholder.jpg';
		}
		elm.draggable({
			cancel: ".trash",
			cursor: "move",
			containment: ".corkboardContainer"
		});

		elm.on('click', ".trash", function() {
			$(this).closest('.ImageCork').addClass('delete');
        });
	}
}

$(document).ready(function() {
	$('input[type=range]').wrap("<div class='range'></div>");
	var i = 1;

	$('.range').each(function() {
		var n = this.getElementsByTagName('input')[0].value;
		var x = (n / 50) * (this.getElementsByTagName('input')[0].offsetWidth - 8) - 12;
		this.id = 'range' + i;
		
		var percent = (n / 50) * 100;
		
		if (this.getElementsByTagName('input')[0].value == 0) {
			this.className = "range"
		} 
		else {
			this.className = "range rangeM"
		}
		
		this.innerHTML += "<style>#" + this.id + " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #3f51b5 0%, #3f51b5 " + percent + "%, #515151 " + percent + "%)} #" + this.id + ":hover input[type=range]:before{content:'" + n + "'!important;left: " + x + "px;} #" + this.id + ":hover input[type=range]:after{left: " + x + "px}</style>";
		i++;
	});

	$('input[type=range]').on("input", function() {
		var a = this.value;
		var p = (a / 50) * (this.offsetWidth - 8) - 12;
		var percent = (a / 50) * 100;
		
		if (a == 0) {
			this.parentNode.className = "range"
		} 
		else {
			this.parentNode.className = "range rangeM"
		}
		
		this.parentNode.getElementsByTagName('style')[0].innerHTML += "#" + this.parentNode.id + " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #3f51b5 0%, #3f51b5 " + percent + "%, #515151 " + percent + "%)} #" + this.parentNode.id + ":hover input[type=range]:before{content:'" + a + "'!important;left: " + p + "px;} #" + this.parentNode.id + ":hover input[type=range]:after{left: " + p + "px}";
		
		$('.ImageCork').css('width', a + '%');
	})
});