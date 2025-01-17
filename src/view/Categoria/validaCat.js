import axios from "axios";
  

    const postCat = async (body) => {
        try {
          const response = await axios.post(`/categoria`, body);
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      };


    const getCat = async ()=>{
        try {
            const response = await axios.get(`/categorias`);
            return response.data;
          } catch (error) {
            console.error(error);
            return [];
          }
    }

    const activarCar = async (id_categoria) =>{
        try {
            const response = await axios.put(`/actCategoria/${id_categoria}`);
            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
    }

    const validaCatg = (data,nombre) => {
        let validador = 'crear';
        data.forEach(async (elem) => {
            
            if(elem.nombre_catg.toLowerCase() === nombre.toLowerCase()){
                if(elem.estado_catg === 'desactivado'){
                    await activarCar(elem.id_categoria);
                    validador = 'activado';
                    
                }else{
                    validador = 'existe';
                }
            }
        });
        return validador;
    }


export {
    getCat,
    postCat,
    validaCatg,
}