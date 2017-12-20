$(document).ready(function() {
	
	$('.deleteUser').on('click', deleteUser);

});

function deleteUser() {
	
	var confirmation = confirm('are you sure you want to delete this entry?');
	if(confirmation){
		
		$.ajax({
			// since 'this' represents that element where data attribute is binded
			type: 'DELETE',
			url: '/users/delete/'+$(this).data('id')
			
		}).done(function() {

			window.location.replace('/');
		
		});
		window.location.replace('/');
	
	}else{
		
		return false;
	
	}
}