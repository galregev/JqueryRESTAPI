window.onload = function(){
	var wrapper = document.querySelector('header'),
			layerOne = document.querySelector('.diamondB');

	wrapper.addEventListener('mousemove',function(e){
		var pageX = e.clientX,
			pageY = e.clientY;
		layerOne.style.webkitTransform = 'translateX(' + pageX/70 + '%) translateY(' + pageY/70 + '%)';
  	    layerOne.style.transform = 'translateX(' + pageX/70 + '%) translateY(' + pageY/70 + '%)';
		wrapper.style = 'background-position:'+ pageX/150 +'px center';
	});
}