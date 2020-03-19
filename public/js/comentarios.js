
import axios from 'axios';
import Swal from 'sweetalert2';



window.addEventListener('DOMContentLoaded', () => {
    
    const comentarios = document.querySelectorAll('.eliminar-comentario');
    if (comentarios.length) {
        comentarios.forEach(comentario =>{
            comentario.addEventListener('click', e => {
                e.preventDefault();
                    Swal.fire({
                      title: 'Quieres Eliminar le comentario',
                      text: "You won't be able to revert this!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.value) {
                            axios.delete(comentario.href)
                            .then(respuesta => {
                                //console.log(respuesta);
                                if (respuesta.status == 200) {
                                    comentario.parentElement.parentElement.remove();
                                    Swal.fire(
                                      'Deleted!',
                                      respuesta.data.mensaje,
                                      'success'
                                    )
                                }
                                
                            })
                            .catch((error) => {
                                Swal.fire(
                                  'Cancelled',
                                  error.response.data.mensaje,
                                  'error'
                                )  
                            });
                      }
                    })
                

                    
            });
        
        });
    }
    
    
    
    
    
    
    
    
    
});
