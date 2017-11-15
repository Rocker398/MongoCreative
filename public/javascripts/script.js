angular.module('ImageCorkboard', [])
  .controller('MainCtrl', mainCtrl)
  .directive('imageCork', imageDirective);

function mainCtrl ($scope, $http) {
	var down = false;
	$(document).mousedown(function() {
		down = true;
	}).mouseup(function() {
		down = false;  
	});

	$scope.images = [];
	$scope.width = 30;
	
	
	$scope.addImage = function (image) {
		var myImage = {ImageURL: image.Url, Top: 0, Left: 0};
		$http.post('/pins', myImage).success(function(data){
			$scope.images.push(data);
		});
		
		image.Url = '';
		setTimeout(triggerSlider, 0.1);
	};

	$scope.getAll = function(){
		return $http.get('/pins').success(function(data){
			angular.copy(data, $scope.images);
		});
	};
	$scope.getAll();

	$scope.delete = function(image){
		console.log("in scope delete");
		console.log(image._id);
		return $http.delete('/pins/:'+image._id+'/delete')
			.success(function(data){
				var pos = $scope.images.indexOf(image);
				if(pos>-1){
					$scope.images.splice(pos,1);
				}
			});
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
					'<div class="trash" ng-click="delete(image)"><img title="Remove" src="https://d30y9cdsu7xlg0.cloudfront.net/png/3823-200.png"></div>'+
					'<img ng-src="{{image.ImageURL}}" />' +
				'</div>' +
			'</div>'
		), /* [3] */
		link: link
	};

	function link (scope, elm) { /* [4] */
		if (!scope.image.ImageURL) {
			scope.image.ImageURL = 'placeholder.jpg';
		}
		elm.draggable({
			cancel: ".trash",
			cursor: "move",
			containment: ".corkboardContainer"
		});

		//elm.on('click', ".trash", function() {
			//var imageCork = $(this).closest('.imageList');
			//imageCork.addClass('delete');
        	//});
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