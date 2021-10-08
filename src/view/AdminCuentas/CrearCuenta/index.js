import { useState } from "react";
import "./creacuenta.css";
import FormPerfil from "./Form";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { ToastContainer } from "react-toastify";
import {
  validarTelefono,
  validarEmail,
  validaTodo,
  contraseñas,
} from "../../Perfil/FormPerfil/validacionForm";
import axios from "axios";

import { notify } from "../../Componentes/notify/Notify";

const Perfil = ({recargaTable, setRecargaTable}) => {
  
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [recarga, setRecarga] = useState(false);
  const [datosCuenta, setDatosCuenta] = useState({
    nombre_usr: "",
    contraseña: "",
    contraConf: "",
    rol: "",
  });
  const [datosPerfil, setDatosPerfil] = useState({
    nombre_pe: "",
    identificacion: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const setDatos = () => {
    setDatosCuenta({
      nombre_usr: "",
      contraseña: "",
      contraConf: "",
      rol: "",
    });
    setDatosPerfil({
      nombre_pe: "",
      identificacion: "",
      telefono: "",
      email: "",
      direccion: "",
    });
    setModal(!modal);
  };

  const guardar = async () => {
    try {
      if (
        validaTodo(datosCuenta) ||
        contraseñas(datosCuenta.contraseña, datosCuenta.contraConf) ||
        validaTodo(datosPerfil) ||
        validarEmail(datosPerfil.email) ||
        validarTelefono(datosPerfil.telefono)
      ) {
        return notify(`Verifique todos los datos ingresados`, '', "error");;
      }
      
      setRecarga(true);

      const bodyP = {
        direccion: datosPerfil.direccion,
        email: datosPerfil.email,
        identificacion: datosPerfil.identificacion,
        nombre_pe: datosPerfil.nombre_pe,
        telefono: datosPerfil.telefono,
      }
  
      const existeUsuario = await axios.get(`/usuarioTodo/${datosCuenta.nombre_usr}`);
  
      if (!existeUsuario.data){
  
        const persona = await axios.post(`/persona`, bodyP);
  
        if (persona.status === 200) {
          const persona_id = persona.data;
          const bodyU = {
            nombre_usr: datosCuenta.nombre_usr,
            contraseña: datosCuenta.contraseña,
            rol: datosCuenta.rol,
            persona_id: persona_id.persona_id,
          };
          const response = await axios.post(`/usuario`, bodyU);
          if (response.status === 201){
            notify(`Se ha agregado el usuario: `, datosCuenta.nombre_usr, "info");
            setRecargaTable(!recargaTable);
            setDatos();
          }else notify(`Error agregando la Información de Usuario`, '', "error");
        }else notify(`Error agregando la Información de Perfil `, '', "error");
      } else notify(`El nombre de usuario ${datosCuenta.nombre_usr} Ya existe`, '', "error");
      setRecarga(false);
    } catch (error) {
      notify("Ha sucedido un problema intente mas tarde, error: ", error);
      setRecarga(false);
    }
  };

  const labelAcc = ["Nombre de Usuario", "Contraseña", "Confirmar Contraseña", "Rol"];
  const labelPerf = ["Nombre", "Cedula", "Telefono", "Email", "Dirección"];

  const handleInputChangeCuenta = (event) => {
    setDatosCuenta({
      ...datosCuenta,
      [event.target.name]: event.target.value,
    });
  };

  const handleInputChangePerfil = (event) => {
    setDatosPerfil({
      ...datosPerfil,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setModal(true)}
          >
            Crear usuario
          </Button>
      <ToastContainer />
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={modal}
        minWidth={700}
        className={classes.modal}
      >
        <DialogTitle>Crear Usuario</DialogTitle>
        <DialogContent>
          <form>
            <div className="modalperfi">
              <FormPerfil
                titulo="Datos de Acceso"
                datos={datosCuenta}
                labels={labelAcc}
                tipo="acc"
                onChange={handleInputChangeCuenta}
                recarga={recarga}
                setRecarga={setRecarga}
              />
              <FormPerfil
                titulo="Perfil"
                datos={datosPerfil}
                labels={labelPerf}
                tipo="perf"
                onChange={handleInputChangePerfil}
                recarga={recarga}
                setRecarga={setRecarga}
              />
            </div>
            <DialogActions className="">
              <div className="botonmodal">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => guardar()}                
                  disabled={recarga}
                >
                  Aceptar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => setDatos()}                  
                  disabled={recarga}
                >
                  cancelar
                </Button>
              </div>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Perfil;

const useStyles = makeStyles((theme) => ({
  modal: {
    "& .MuiDialog-paper": {
      background: "cornflowerblue",
    },
    "& .MuiDialogTitle-root": {
      textAlign: "center",
    },
    "& .MuiTypography-h6": {
      fontWeight: "bold",
      fontSize: "1.75rem",
      color: "aliceblue",
    },
  },
}));
