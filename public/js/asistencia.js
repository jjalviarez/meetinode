
import axios from 'axios';


window.addEventListener('DOMContentLoaded', () => {
    
    const asistencia = document.getElementById('confirmar-asistencia')
    if (asistencia) {
        
        const btnAsistencia = document.getElementById('asistencia')
        asistencia.addEventListener('submit', e => {
            e.preventDefault();
            let nuevoValor;
            const datos = {
                accion:true
            };
            if (btnAsistencia.classList.contains('btn-azul')) {
                        nuevoValor = "Cancelar";
                    }
            else {
                nuevoValor = "Si";
                datos.accion=false;
            }
            
            axios.post(e.target.action, datos)
                .then(respuesta => {
                    console.log(respuesta);
                    btnAsistencia.value = nuevoValor;
                    btnAsistencia.classList.toggle("btn-azul");
                    btnAsistencia.classList.toggle("btn-rojo");
                    /*
                  if (respuesta.status === 200) {
                    Boton.parentElement.parentElement.parentElement.removeChild(Boton.parentElement.parentElement);

                  } 
                })
                .catch(()=> {
*/

                });
        });
    }
    
    
    
    
    
    
    
    
    
});
